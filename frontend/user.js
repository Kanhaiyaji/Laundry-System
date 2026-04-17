const API_URL = window.APP_CONFIG?.API_URL || 'https://laundry-system-x7t5.onrender.com';

const garmentsList = document.getElementById('garmentsList');
const garmentTemplate = document.getElementById('garmentTemplate');
const createOrderForm = document.getElementById('createOrderForm');
const trackOrderForm = document.getElementById('trackOrderForm');
const addGarmentBtn = document.getElementById('addGarmentBtn');

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
    address: document.getElementById('address').value.trim(),
    garments
  };

  try {
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
  } catch (error) {
    setMessage('createOrderMessage', 'Cannot connect to server. Please ensure backend is running on port 3000.', 'error');
  }
});

trackOrderForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('trackOrderMessage', '', 'success');

  const orderId = document.getElementById('trackOrderId').value.trim();
  const target = document.getElementById('trackedOrderResult');
  target.innerHTML = '<div class="loading">Loading order...</div>';

  try {
    const response = await fetch(`${API_URL}/api/orders/${encodeURIComponent(orderId)}`);
    const data = await response.json();

    if (!response.ok || !data.success) {
      target.innerHTML = '';
      setMessage('trackOrderMessage', data.message || 'Order not found.', 'error');
      return;
    }

    setMessage('trackOrderMessage', `Status: ${data.data.status}`, 'success');
    target.innerHTML = renderOrder(data.data);
  } catch (error) {
    target.innerHTML = '';
    setMessage('trackOrderMessage', 'Cannot connect to server. Please ensure backend is running on port 3000.', 'error');
  }
});

addGarmentBtn.addEventListener('click', addGarmentRow);

// Initialize with one empty garment row on page load
addGarmentRow();
