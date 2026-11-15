const host = location.hostname;
const configuredAuthBase = document.querySelector('meta[name="auth-api-base"]')?.content.trim();
const authBase = configuredAuthBase || (location.protocol === 'file:' ? 'http://127.0.0.1:3000/auth-api' : ['localhost','127.0.0.1'].includes(host) ? `http://${host}:3000/auth-api` : '/auth-api');
const localPythonApi = location.protocol === 'file:' ? 'http://127.0.0.1:8000/api' : ['localhost','127.0.0.1'].includes(host) ? `http://${host}:8000/api` : null;
const tabs = [...document.querySelectorAll('[data-auth-tab]')];
const panels = { login: document.querySelector('#loginPanel'), register: document.querySelector('#registerPanel') };
const feedback = document.querySelector('#authFeedback');
let csrfToken = '';
function selectPanel(name) {
  tabs.forEach(tab => { const active = tab.dataset.authTab === name; tab.classList.toggle('is-active', active); tab.setAttribute('aria-selected', String(active)); });
  Object.entries(panels).forEach(([key,panel]) => panel.hidden = key !== name);
  document.querySelector('#authTitle').textContent = name === 'login' ? 'Build what matters.' : 'Create your account.';
  feedback.hidden = true;
}
tabs.forEach(tab => tab.addEventListener('click', () => selectPanel(tab.dataset.authTab)));
document.querySelectorAll('[data-switch-auth]').forEach(button => button.addEventListener('click', () => selectPanel(button.dataset.switchAuth)));
document.querySelectorAll('.password-toggle').forEach(button => button.addEventListener('click', () => {
  const input = button.parentElement.querySelector('input'); const show = input.type === 'password'; input.type = show ? 'text' : 'password'; button.textContent = show ? 'Hide' : 'Show'; button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} password`);
}));
function announce(message, error = false) { feedback.textContent = message; feedback.dataset.error = String(error); feedback.hidden = false; }
async function request(path, options = {}) {
  let response;
  try {
    if (!csrfToken) csrfToken = (await fetch(`${authBase}/csrf`, { credentials: 'include' }).then(r => r.json())).csrfToken;
    response = await fetch(`${authBase}${path}`, { credentials: 'include', ...options, headers: { 'Content-Type': 'application/json', ...(options.method && options.method !== 'GET' ? { 'X-CSRF-Token': csrfToken } : {}), ...(options.headers || {}) } });
  } catch {
    if (localPythonApi) {
      const legacyPath = path === '/register' ? '/account/register' : path === '/login' ? '/account/login' : path === '/session' ? '/account/session' : null;
      if (legacyPath) {
        let body = options.body ? JSON.parse(options.body) : {};
        if (path === '/register') body = { name: body.fullName, email: body.email, password: body.password };
        if (path === '/login') body = { email: body.email, password: body.password, remember: body.remember };
        const legacy = await fetch(`${localPythonApi}${legacyPath}`, { method: options.method || 'GET', credentials: 'include', ...(options.method ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
        const legacyData = await legacy.json().catch(() => ({}));
        if (path === '/login' && legacy.status === 401) {
          const name = body.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).slice(0, 100);
          const created = await fetch(`${localPythonApi}/account/register`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email: body.email, password: body.password }) });
          const createdData = await created.json().catch(() => ({}));
          if (created.ok) return createdData;
          throw new Error(createdData.detail || legacyData.detail || `Request failed (${created.status}).`);
        }
        if (!legacy.ok) throw new Error(legacyData.detail || `Request failed (${legacy.status}).`);
        return path === '/session' ? { user: { ...legacyData.customer, username: legacyData.customer.email.split('@')[0], createdAt: '' } } : legacyData;
      }
    }
    throw new Error(`Authentication API is unreachable at ${authBase}. Redeploy the Vercel project with the /auth-api route and set TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, and AUTH_SECRET in its environment variables.`);
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data;
}
async function submitForm(form, endpoint) {
  if (!form.reportValidity()) return;
  const button = form.querySelector('[type="submit"]'); button.disabled = true; button.classList.add('is-loading');
  try {
    await request(endpoint, { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
    const returnTo = new URLSearchParams(location.search).get('next');
    const safeReturn = returnTo && !returnTo.startsWith('/') && !returnTo.includes('..') && !returnTo.includes(':') ? returnTo : null;
    location.href = safeReturn || (endpoint === '/login' ? 'index.html' : 'dashboard.html');
  }
  catch(error) { announce(error.message, true); }
  finally { button.disabled = false; button.classList.remove('is-loading'); }
}
document.querySelector('#loginForm').addEventListener('submit', e => { e.preventDefault(); submitForm(e.currentTarget, '/login'); });
document.querySelector('#registerForm').addEventListener('submit', e => { e.preventDefault(); submitForm(e.currentTarget, '/register'); });
const registerPassword = document.querySelector('#registerPassword');
registerPassword.addEventListener('input', () => {
  const value = registerPassword.value; const score = [value.length >= 8, /[A-Z]/.test(value), /[a-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
  const meter = document.querySelector('#strengthMeter'); meter.style.width = `${score * 20}%`; meter.dataset.level = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';
  document.querySelector('#strengthCopy').textContent = value.length ? ['Very weak','Weak','Fair','Good','Strong','Strong'][score] : 'Use 8 or more characters.';
});
if (location.hash === '#signup' || location.hash === '#register') selectPanel('register');
request('/session').then(() => { location.replace('dashboard.html'); }).catch(() => {});
