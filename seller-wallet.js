const statusBox = document.querySelector('#walletStatus');
const balance = document.querySelector('#walletBalance');
const transactions = document.querySelector('#walletTransactions');
const rows = document.querySelector('#walletRows');
const walletEndpoint = ['localhost','127.0.0.1'].includes(location.hostname)
  ? `http://${location.hostname}:8001/api/seller/wallet`
  : '/api/seller/wallet';
let refreshInProgress = false;
let walletFailed = false;
const money = value => `ETB ${new Intl.NumberFormat('en-ET',{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(value)||0)}`;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function refreshWallet() {
  if (refreshInProgress || walletFailed) return;
  refreshInProgress = true;
  try {
    const response = await fetch(walletEndpoint, { credentials: 'include' });
    const wallet = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(wallet.detail || `Wallet request failed (${response.status}).`); error.status = response.status; throw error; }
    statusBox.hidden = true;
    balance.hidden = false;
    transactions.hidden = false;
    document.querySelector('#walletAvailable').textContent = money(wallet.availableBalance);
    document.querySelector('#walletSellerName').textContent = wallet.seller;
    document.querySelector('#walletGross').textContent = money(wallet.grossSales);
    document.querySelector('#walletCommission').textContent = money(wallet.commission);
    document.querySelector('#walletPending').textContent = money(wallet.pendingEarnings);
    document.querySelector('#walletRate').textContent = `${wallet.commissionRate}%`;
    rows.innerHTML = wallet.transactions.map(tx => `<tr><td><strong>${escapeHtml(tx.orderId)}</strong></td><td>${new Date(tx.date).toLocaleDateString()}</td><td>${money(tx.gross)}</td><td>${money(tx.commission)}</td><td><strong>${money(tx.net)}</strong></td><td>${escapeHtml(tx.status)}</td></tr>`).join('');
    document.querySelector('#walletEmpty').hidden = wallet.transactions.length > 0;
  } catch (error) {
    walletFailed = true;
    statusBox.textContent = error.message || 'Wallet is unavailable.';
    if (error.status === 401) {
      statusBox.textContent = 'Sign in with the account email used for your seller application to view your wallet.';
      const link = document.createElement('a');
      link.href = 'account.html?next=seller-wallet.html#login';
      link.textContent = 'Login';
      link.className = 'button button-dark';
      statusBox.append(' ', link);
    }
  } finally {
    refreshInProgress = false;
  }
}
refreshWallet();
window.setInterval(() => { if (!document.hidden) refreshWallet(); }, 15000);
window.addEventListener('focus', refreshWallet);
