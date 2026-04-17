const API_URL = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
const ADMIN_AUTH_KEY = 'laundry-admin-auth';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const loginPanel = document.getElementById('loginPanel');
const adminShell = document.getElementById('adminShell');
const statusPanel = document.getElementById('statusPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminStatusForm = document.getElementById('adminStatusForm');
const refreshAdminBtn = document.getElementById('refreshAdminBtn');
const logoutAdminBtn = document.getElementById('logoutAdminBtn');

function setMessage(targetId, text, type) {
  const target = document.getElementById(targetId);
  target.innerHTML = text ? `<div class="message ${type}">${text}</div>` : '';
}

function isAuthenticated() {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

function showAdminArea() {
  loginPanel.classList.add('hidden');
  adminShell.classList.remove('hidden');
  statusPanel.classList.remove('hidden');
}

function renderOrder(order) {
  return `
    <article class="order-card">
      <div class="panel-header">
        <div>
          <h3>${order.orderId}</h3>
          <div class="order-meta">
            <div><strong>Customer:</strong> ${order.customerName}</div>
            <div><strong>Phone:</strong> ${order.phoneNumber}</div>
            <div class="order-meta-address"><strong>Delivery Address:</strong> ${order.address || '-'}</div>
            <div><strong>Total Bill:</strong> $${Number(order.totalBill).toFixed(2)}</div>
            <div><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <span class="status-chip status-${String(order.status).toLowerCase()}">${order.status}</span>
      </div>
      <ul class="order-garments">
        ${(order.garments || []).map((garment) => `<li>${garment.quantity} x ${garment.type} @ $${Number(garment.price).toFixed(2)}</li>`).join('')}
      </ul>
    </article>
  `;
}

async function loadDashboard() {
  const statsTarget = document.getElementById('dashboardStats');
  const ordersTarget = document.getElementById('dashboardOrders');
  statsTarget.innerHTML = '<div class="loading">Loading dashboard...</div>';
  ordersTarget.innerHTML = '';

  const response = await fetch(`${API_URL}/admin/dashboard`);
  const data = await response.json();

  if (!data.success) {
    statsTarget.innerHTML = '<div class="empty-state">Dashboard not available.</div>';
    return;
  }

  const dashboard = data.data;
  statsTarget.innerHTML = `
    <div class="stat-card"><h3>Total Orders</h3><div class="stat-value">${dashboard.totalOrders}</div></div>
    <div class="stat-card"><h3>Total Revenue</h3><div class="stat-value">$${Number(dashboard.totalRevenue).toFixed(2)}</div></div>
    <div class="stat-card"><h3>Received</h3><div class="stat-value">${dashboard.ordersByStatus.RECEIVED}</div></div>
    <div class="stat-card"><h3>Processing</h3><div class="stat-value">${dashboard.ordersByStatus.PROCESSING}</div></div>
    <div class="stat-card"><h3>Ready</h3><div class="stat-value">${dashboard.ordersByStatus.READY}</div></div>
    <div class="stat-card"><h3>Delivered</h3><div class="stat-value">${dashboard.ordersByStatus.DELIVERED}</div></div>
  `;

  ordersTarget.innerHTML = dashboard.orders.length
    ? dashboard.orders.map(renderOrder).join('')
    : '<div class="empty-state">No orders yet.</div>';
}

adminLoginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('adminUsername').value.trim();
  const password = document.getElementById('adminPassword').value.trim();

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    setMessage('adminLoginMessage', 'Invalid admin credentials.', 'error');
    return;
  }

  sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  setMessage('adminLoginMessage', 'Login successful.', 'success');
  showAdminArea();
  await loadDashboard();
});

adminStatusForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('adminStatusMessage', '', 'success');

  const orderId = document.getElementById('adminOrderId').value.trim();
  const status = document.getElementById('adminStatus').value;

  const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    setMessage('adminStatusMessage', data.message || 'Status update failed.', 'error');
    return;
  }

  setMessage('adminStatusMessage', `Order ${orderId} updated to ${status}.`, 'success');
  adminStatusForm.reset();
  await loadDashboard();
});

refreshAdminBtn.addEventListener('click', loadDashboard);
logoutAdminBtn.addEventListener('click', () => {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
  window.location.reload();
});

if (isAuthenticated()) {
  showAdminArea();
  loadDashboard();
}
