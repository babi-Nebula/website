const host = location.hostname;
const authBase = document.querySelector('meta[name="auth-api-base"]')?.content.trim() || (location.protocol === 'file:' ? 'http://127.0.0.1:3000/auth-api' : ['localhost','127.0.0.1'].includes(host) ? `http://${host}:3000/auth-api` : '/auth-api');
const localPythonApi = location.protocol === 'file:' ? 'http://127.0.0.1:8000/api' : ['localhost','127.0.0.1'].includes(host) ? `http://${host}:8000/api` : null;
async function csrf() { return (await fetch(`${authBase}/csrf`, { credentials: 'include' }).then(r => r.json())).csrfToken; }
fetch(`${authBase}/dashboard`, { credentials: 'include' }).then(async response => {
  if (response.status === 401) { location.replace('account.html#login'); return null; }
  const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to load your dashboard.'); return data;
}).then(data => {
  if (!data) return;
  document.querySelector('#dashboardGreeting').textContent = `Welcome back, ${data.user.name}.`;
  document.querySelector('#profileName').textContent = data.user.name;
  document.querySelector('#profileEmail').textContent = data.user.email;
  document.querySelector('#profileUsername').textContent = `@${data.user.username}`;
  document.querySelector('#profileCreated').textContent = `Member since ${new Date(data.user.createdAt).toLocaleDateString()}`;
}).catch(async () => {
  if (localPythonApi) {
    try {
      const response = await fetch(`${localPythonApi}/account/session`, { credentials: 'include' });
      if (response.ok) {
        const { customer } = await response.json();
        document.querySelector('#dashboardGreeting').textContent = `Welcome back, ${customer.name}.`;
        document.querySelector('#profileName').textContent = customer.name;
        document.querySelector('#profileEmail').textContent = customer.email;
        document.querySelector('#profileUsername').textContent = `@${customer.email.split('@')[0]}`;
        document.querySelector('#profileCreated').textContent = '';
        return;
      }
    } catch { /* fall through to the login page */ }
  }
  location.replace('account.html#login');
});
document.querySelector('#logoutButton').addEventListener('click', async () => {
  try {
    const token = await csrf();
    await fetch(`${authBase}/logout`, { method: 'POST', credentials: 'include', headers: { 'X-CSRF-Token': token } });
  } catch {
    if (localPythonApi) await fetch(`${localPythonApi}/account/logout`, { method: 'POST', credentials: 'include' });
  }
  location.replace('account.html#login');
});
