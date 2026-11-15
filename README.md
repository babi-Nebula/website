# ENQU MADE

ENQU MADE is an Ethiopian artisan marketplace with a Node.js authentication service. Locally it uses SQLite; on Vercel it uses Turso, a hosted SQLite-compatible database, so account data persists across serverless instances. The existing FastAPI marketplace service continues to provide products, seller applications, orders, and admin approvals.

## Local setup

Requirements: Python 3.11+, Node.js 20+, and npm.

1. Install the Python marketplace dependencies and run the marketplace API/static host on port 8000:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
py -m pip install -r requirements.txt
py -m uvicorn app:app --reload --port 8000
```

2. In a second terminal, install the Node auth service:

```powershell
Copy-Item backend/.env.example backend/.env
npm install
npm run dev
```

Set a unique `AUTH_SECRET` of at least 32 characters in `backend/.env`. The Node service listens on port 3000 and creates `backend/enqu-auth.sqlite` automatically. Open `http://127.0.0.1:8000` so the frontend can reach both services.

## Authentication

- `POST /auth-api/register` validates full name, unique username and email, password confirmation, and terms acceptance; hashes passwords with bcrypt and creates the account in SQLite.
- `POST /auth-api/login` verifies existing accounts, creates a profile on first login for a new email, and sets an HTTP-only session cookie. Existing accounts still require the matching password.
- `GET /auth-api/session` checks the active session; `POST /auth-api/logout` revokes it.
- `GET /auth-api/dashboard` is protected and returns the signed-in profile.
- Password reset uses one-time, hashed tokens and requires SMTP configuration (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`) and `PUBLIC_BASE_URL`.

Mutating auth requests use a double-submit CSRF token. Login, registration, and reset requests are rate limited. Auth tokens are never stored in browser local storage. User accounts have `active` or `disabled` status.

## Vercel deployment

The root `app.py` is the FastAPI application for the marketplace API and serves the HTML/CSS/JS pages. Vercel detects FastAPI and deploys it with the Python runtime. The Vercel rewrite sends `/auth-api/*` requests to a Node.js function under `api/auth-api/`. That function uses Turso instead of a local SQLite file, because Vercel function filesystems are ephemeral. Create a Turso database and set these Vercel environment variables for every deployment environment:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `AUTH_SECRET` (at least 32 random characters)
- `PUBLIC_BASE_URL` (the deployed site URL)
- `DATABASE_URL` (a persistent PostgreSQL connection string for marketplace products, orders, sellers, and admin approvals)
- `ADMIN_PASSWORD` (a unique admin password)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `SMTP_FROM` for password resets

Connect this project to Vercel by importing its Git repository or deploying the project directory with the Vercel CLI. Set the variables above in Project Settings before the production deployment. The default `/auth-api` URL is same-origin and the account pages do not need a separate API host. The local Node service uses the SQLite file; the Vercel function uses the configured persistent Turso database. `.vercelignore` prevents local environment files, local databases, and virtual environments from being uploaded.

## Marketplace and admin

The Python FastAPI application serves the marketplace pages and its existing `/api/*` catalog, seller, order, and admin approval endpoints. Set `ADMIN_PASSWORD` for admin access and configure a persistent PostgreSQL `DATABASE_URL` for marketplace records. Auth accounts use Turso on Vercel. Set `FRONTEND_ORIGINS` to the deployed frontend origins when making cross-origin API calls and enable HTTPS (`NODE_ENV=production`).

## Verification

With both services running, check `http://127.0.0.1:3000/auth-api/health`, create an account at `account.html#register`, sign in at `account.html#login`, visit `dashboard.html`, and log out. Duplicate-email, invalid-password, expired reset-token, and unauthenticated dashboard requests return explicit errors. The auth UI has no Google button because no OAuth provider is configured.
