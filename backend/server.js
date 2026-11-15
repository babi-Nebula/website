const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const { rateLimit } = require('express-rate-limit');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === 'production';
const secret = process.env.AUTH_SECRET || '';
if (isProduction && secret.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters in production.');
const cookieSecure = isProduction;
const cookieOptions = { httpOnly: true, secure: cookieSecure, sameSite: 'strict', path: '/' };
const origins = (process.env.FRONTEND_ORIGINS || 'null,http://127.0.0.1:8000,http://localhost:8000,http://127.0.0.1:5500,http://localhost:5500').split(',').map(x => x.trim());
const db = new Database(path.join(__dirname, 'enqu-auth.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, full_name TEXT NOT NULL, username TEXT NOT NULL COLLATE NOCASE UNIQUE,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE, password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL, account_status TEXT NOT NULL DEFAULT 'active'
      CHECK(account_status IN ('active','disabled'))
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL, created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL, created_at TEXT NOT NULL
  );
`);

app.disable('x-powered-by');
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin(origin, callback) { if (!origin || origins.includes(origin)) return callback(null, true); callback(new Error('Origin is not allowed.')); }, credentials: true, methods: ['GET','POST'], allowedHeaders: ['Content-Type','X-CSRF-Token'] }));
app.use(express.json({ limit: '20kb' }));
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many attempts. Wait a few minutes and try again.' } });
const resetLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const hashToken = value => crypto.createHmac('sha256', secret || 'enqu-made-local-development').update(value).digest('hex');
const randomToken = () => crypto.randomBytes(32).toString('base64url');
const safeEqual = (a, b) => { const x = Buffer.from(String(a || '')); const y = Buffer.from(String(b || '')); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function fail(res, status, error) { return res.status(status).json({ error }); }
function csrf(req, res, next) {
  const cookie = req.cookies?.enqu_csrf || req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('enqu_csrf='))?.slice(10);
  if (!safeEqual(cookie, req.get('X-CSRF-Token'))) return fail(res, 403, 'Refresh the page and try again.');
  next();
}
function setCsrfCookie(res, token) { res.cookie('enqu_csrf', token, { httpOnly: false, secure: cookieSecure, sameSite: 'strict', path: '/', maxAge: 2 * 60 * 60 * 1000 }); }
function createCsrf(req, res) { const token = randomToken(); setCsrfCookie(res, token); res.json({ csrfToken: token }); }
function currentUser(req, res, next) {
  const token = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('enqu_session='))?.slice('enqu_session='.length);
  if (!token) return fail(res, 401, 'Sign in to continue.');
  const tokenHash = hashToken(decodeURIComponent(token));
  const session = db.prepare(`SELECT u.id,u.full_name,u.username,u.email,u.created_at,u.account_status,s.expires_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=?`).get(tokenHash);
  if (!session || session.expires_at <= Date.now() || session.account_status !== 'active') {
    if (session) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(tokenHash);
    res.clearCookie('enqu_session', cookieOptions);
    return fail(res, 401, 'Your session expired. Sign in again.');
  }
  req.user = { id: session.id, name: session.full_name, username: session.username, email: session.email, createdAt: session.created_at };
  next();
}
function startSession(req, res, user, remember) {
  const token = randomToken();
  const duration = remember ? 30 * 86400000 : 12 * 3600000;
  db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').run(hashToken(token), user.id, Date.now() + duration, new Date().toISOString());
  res.cookie('enqu_session', token, { ...cookieOptions, maxAge: duration });
  res.json({ user: { id: user.id, name: user.full_name, username: user.username, email: user.email } });
}
app.get('/auth-api/csrf', createCsrf);
app.get('/auth-api/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/auth-api/register', authLimiter, csrf, async (req, res) => {
  const { fullName, username, email, password, confirmPassword } = req.body || {};
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) return fail(res, 422, 'Enter your full name (2–100 characters).');
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,24}$/.test(username)) return fail(res, 422, 'Username must be 3–24 characters using letters, numbers, or underscores.');
  if (typeof email !== 'string' || email.length > 160 || !emailPattern.test(email)) return fail(res, 422, 'Enter a valid email address.');
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return fail(res, 422, 'Password must be 8–72 characters.');
  if (password !== confirmPassword) return fail(res, 422, 'Passwords do not match.');
  if (!req.body.termsAccepted) return fail(res, 422, 'Accept the Terms and Conditions to continue.');
  const emailValue = email.trim().toLowerCase();
  if (db.prepare('SELECT 1 FROM users WHERE email=? OR username=? COLLATE NOCASE').get(emailValue, username.trim())) return fail(res, 409, 'That email or username is already registered.');
  const user = { id: crypto.randomUUID(), full_name: fullName.trim(), username: username.trim(), email: emailValue, created_at: new Date().toISOString() };
  try {
    db.prepare('INSERT INTO users(id,full_name,username,email,password_hash,created_at) VALUES(?,?,?,?,?,?)').run(user.id,user.full_name,user.username,user.email,await bcrypt.hash(password,12),user.created_at);
  } catch (error) { if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return fail(res, 409, 'That email or username is already registered.'); throw error; }
  startSession(req, res, user, false);
});
app.post('/auth-api/login', authLimiter, csrf, async (req, res) => {
  const { email, password, remember } = req.body || {};
  if (typeof email !== 'string' || !emailPattern.test(email) || typeof password !== 'string' || !password.length || password.length > 72) return fail(res, 422, 'Enter a valid email and password.');
  let user = db.prepare('SELECT * FROM users WHERE email=? COLLATE NOCASE').get(email.trim());
  if (user && (user.account_status !== 'active' || !(await bcrypt.compare(password,user.password_hash)))) return fail(res, 401, 'Email or password was not accepted.');
  if (!user) {
    if (password.length < 8) return fail(res, 422, 'Password must be at least 8 characters.');
    const localPart = email.trim().split('@')[0];
    const fullName = localPart.replace(/[._-]+/g,' ').trim().slice(0,100).replace(/\b\w/g,c=>c.toUpperCase()) || 'New Member';
    const base = localPart.toLowerCase().replace(/[^a-z0-9_]/g,'').slice(0,18).padEnd(3,'x');
    let username = base;
    while (db.prepare('SELECT 1 FROM users WHERE username=? COLLATE NOCASE').get(username)) username = `${base.slice(0,18)}${crypto.randomBytes(2).toString('hex')}`;
    user = { id:crypto.randomUUID(), full_name:fullName, username, email:email.trim().toLowerCase(), created_at:new Date().toISOString(), password_hash:await bcrypt.hash(password,12), account_status:'active' };
    try { db.prepare('INSERT INTO users(id,full_name,username,email,password_hash,created_at) VALUES(?,?,?,?,?,?)').run(user.id,user.full_name,user.username,user.email,user.password_hash,user.created_at); }
    catch (error) { user = db.prepare('SELECT * FROM users WHERE email=? COLLATE NOCASE').get(email.trim()); if (!user || !(await bcrypt.compare(password,user.password_hash))) return fail(res,401,'Email or password was not accepted.'); }
  }
  startSession(req, res, user, Boolean(remember));
});
app.get('/auth-api/session', currentUser, (req, res) => res.json({ user: req.user }));
app.post('/auth-api/logout', csrf, (req, res) => {
  const token = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('enqu_session='))?.slice('enqu_session='.length);
  if (token) db.prepare('DELETE FROM sessions WHERE token_hash=?').run(hashToken(decodeURIComponent(token)));
  res.clearCookie('enqu_session', cookieOptions).json({ authenticated: false });
});
app.post('/auth-api/password-reset/request', resetLimiter, csrf, async (req, res) => {
  const { email } = req.body || {};
  if (typeof email !== 'string' || !emailPattern.test(email)) return fail(res, 422, 'Enter a valid email address.');
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.SMTP_FROM) return fail(res, 503, 'Password reset email is not configured yet.');
  const user = db.prepare('SELECT id,email FROM users WHERE email=? COLLATE NOCASE').get(email.trim());
  if (user) {
    const token = randomToken();
    db.prepare('INSERT INTO password_reset_tokens(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').run(hashToken(token),user.id,Date.now()+3600000,new Date().toISOString());
    const transport = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT || 587) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } });
    await transport.sendMail({ from: process.env.SMTP_FROM, to: user.email, subject: 'Reset your ENQU MADE password', text: `Reset your password: ${(process.env.PUBLIC_BASE_URL || '').replace(/\/$/,'')}/reset-password.html?token=${encodeURIComponent(token)}\nThis link expires in one hour.` });
  }
  res.json({ message: 'If that email belongs to an account, password reset instructions have been sent.' });
});
app.post('/auth-api/password-reset/complete', resetLimiter, csrf, async (req, res) => {
  const { token, password, confirmPassword } = req.body || {};
  if (typeof token !== 'string' || typeof password !== 'string' || password.length < 8 || password.length > 72 || password !== confirmPassword) return fail(res, 422, 'Enter matching passwords of at least 8 characters.');
  const digest = hashToken(token);
  const reset = db.prepare('SELECT user_id,expires_at FROM password_reset_tokens WHERE token_hash=?').get(digest);
  if (!reset || reset.expires_at <= Date.now()) return fail(res, 400, 'That reset link is invalid or expired.');
  const hash = await bcrypt.hash(password,12);
  const update = db.transaction(() => { db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(hash,reset.user_id); db.prepare('DELETE FROM password_reset_tokens WHERE user_id=?').run(reset.user_id); db.prepare('DELETE FROM sessions WHERE user_id=?').run(reset.user_id); });
  update(); res.json({ message: 'Password updated. You can now sign in.' });
});
app.get('/auth-api/dashboard', currentUser, (req, res) => res.json({ user: req.user, message: 'Welcome to The Business Mindset Ethiopia.' }));
app.listen(port, () => console.log(`ENQU MADE auth API listening on port ${port}`));
