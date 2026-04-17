const API_URL = window.APP_CONFIG?.API_URL || 'https://laundry-system-x7t5.onrender.com';

const garmentsList = document.getElementById('garmentsList');
const garmentTemplate = document.getElementById('garmentTemplate');
const createOrderForm = document.getElementById('createOrderForm');
const updateStatusForm = document.getElementById('updateStatusForm');
const addGarmentBtn = document.getElementById('addGarmentBtn');
const refreshDashboardBtn = document.getElementById('refreshDashboardBtn');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');

function setMessage(targetId, text, type) {
  const target = document.getElementById(targetId);
  target.innerHTML = text ? `<div class="message ${type}">${text}</div>` : '';
}

function addGarmentRow() {
  const fragment = garmentTemplate.content.cloneNode(true);
  const row = fragment.querySelector('.garment-row');
  const removeButton = fragment.querySelector('.garment-remove');

  removeButton.addEventListener('click', () => {
    row.remove();
    if (!garmentsList.children.length) {
      addGarmentRow();
    }
  });

  garmentsList.appendChild(fragment);
}

function getGarments() {
  return [...document.querySelectorAll('.garment-row')]
    .map((row) => ({
      type: row.querySelector('.garment-type').value.trim(),
      quantity: Number(row.querySelector('.garment-quantity').value),
      price: Number(row.querySelector('.garment-price').value)
    }))
    .filter((garment) => garment.type && garment.quantity > 0 && garment.price >= 0);
}

function statusClass(status) {
  return `status-${String(status || '').toLowerCase()}`;
}

function renderOrder(order) {
  const garments = order.garments || [];
  return `
    <article class="order-card">
      <div class="order-card-head">
        <div>
          <h3>${order.orderId}</h3>
          <div class="order-meta">
            <div><strong>Customer:</strong> ${order.customerName}</div>
            <div><strong>Phone:</strong> ${order.phoneNumber}</div>
            <div><strong>Total Bill:</strong> $${Number(order.totalBill).toFixed(2)}</div>
            <div><strong>Created:</strong> ${new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <span class="status-chip ${statusClass(order.status)}">${order.status}</span>
      </div>
      <ul class="order-garments">
        ${garments.map((garment) => `<li>${garment.quantity} x ${garment.type} @ $${Number(garment.price).toFixed(2)}</li>`).join('')}
      </ul>
    </article>
  `;
}

async function loadOrders(queryString = '') {
  const target = document.getElementById('ordersList');
  target.innerHTML = '<div class="loading">Loading orders...</div>';

  const response = await fetch(`${API_URL}/api/orders${queryString}`);
  const data = await response.json();

  if (!data.success || !data.data.length) {
    target.innerHTML = '<div class="empty-state">No orders found.</div>';
    return;
  }

  target.innerHTML = data.data.map(renderOrder).join('');
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

createOrderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('createOrderMessage', '', 'success');

  const garments = getGarments();
  if (!garments.length) {
    setMessage('createOrderMessage', 'Add at least one valid garment.', 'error');
    return;
  }

  const payload = {
    customerName: document.getElementById('customerName').value.trim(),
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    garments
  };

  const response = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    const message = Array.isArray(data.errors) ? data.errors.join(', ') : data.message || 'Order creation failed.';
    setMessage('createOrderMessage', message, 'error');
    return;
  }

  setMessage('createOrderMessage', `Order created successfully: ${data.data.orderId}`, 'success');
  createOrderForm.reset();
  garmentsList.innerHTML = '';
  addGarmentRow();
  await loadOrders();
  await loadDashboard();
});

updateStatusForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('updateStatusMessage', '', 'success');

  const orderId = document.getElementById('orderIdToUpdate').value.trim();
  const status = document.getElementById('newStatus').value;

  const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    setMessage('updateStatusMessage', data.message || 'Status update failed.', 'error');
    return;
  }

  setMessage('updateStatusMessage', `Status updated to ${status}.`, 'success');
  updateStatusForm.reset();
  await loadOrders();
  await loadDashboard();
});

addGarmentBtn.addEventListener('click', addGarmentRow);
refreshDashboardBtn.addEventListener('click', loadDashboard);
applyFiltersBtn.addEventListener('click', async () => {
  const status = document.getElementById('filterStatus').value;
  const customerName = document.getElementById('filterCustomerName').value.trim();
  const phoneNumber = document.getElementById('filterPhoneNumber').value.trim();
  const params = new URLSearchParams();

  if (status) params.set('status', status);
  if (customerName) params.set('customerName', customerName);
  if (phoneNumber) params.set('phoneNumber', phoneNumber);

  await loadOrders(params.toString() ? `?${params.toString()}` : '');
});

clearFiltersBtn.addEventListener('click', async () => {
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterCustomerName').value = '';
  document.getElementById('filterPhoneNumber').value = '';
  await loadOrders();
});

async function boot() {
  addGarmentRow();
  await loadOrders();
  await loadDashboard();
}

boot().catch((error) => {
  setMessage('createOrderMessage', error.message, 'error');
});
