import { apiFetch } from './api.js';
import { Store } from './store.js';

// Init
document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getUser();
    if (!user) {
        alert('Please login first.');
        window.location.href = '/login.html';
        return;
    }
    // Ideally, we check if user.isAdmin on client side too, but server is truth
    loadAdminProducts();
    loadAdminOrders();

    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        Store.logout();
        window.location.href = '/login.html';
    });
});

// Load Products with Delete Button
// Navigation Logic
window.toggleSidebar = () => {
    document.getElementById('admin-sidebar').classList.toggle('active');
    document.getElementById('admin-overlay').classList.toggle('active');
};

window.showSection = (sectionId) => {
    // Hide all
    document.querySelectorAll('.admin-section').forEach(el => el.classList.remove('active'));
    // Show target
    document.getElementById(`section-${sectionId}`).classList.add('active');
    // Update Sidebar Active state
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
    event.target.classList.add('active');

    // Close sidebar on mobile
    if (window.innerWidth < 768) window.toggleSidebar();
};

// Load Products with Stock Management
async function loadAdminProducts() {
    const grid = document.getElementById('admin-products');
    try {
        const products = await apiFetch('/products');
        grid.innerHTML = products.map(p => `
      <div class="card">
        <img src="${p.imageUrl || 'https://via.placeholder.com/300'}" style="height:150px; object-fit:cover;" />
        <div class="card-body">
          <h3>${p.name}</h3>
          <p style="color:var(--accent-color);">₹${p.price}</p>
          
          <div style="margin: 0.5rem 0;">
            <label style="font-size:0.8rem;">Stock:</label>
            <div style="display:flex; gap:0.5rem;">
                <input type="number" id="stock-${p._id}" value="${p.stock || 0}" class="form-control" style="padding:0.25rem; width:60px;" />
                <button class="btn" style="padding:0.25rem 0.5rem; font-size:0.8rem;" onclick="updateStock('${p._id}')">Update</button>
            </div>
          </div>

          <button class="btn-outline" onclick="deleteProduct('${p._id}')" style="margin-top:0.5rem; border-color:var(--error); color:var(--error); width:100%;">
            Remove from Store
          </button>
        </div>
      </div>
    `).join('');
    } catch (err) {
        console.error(err);
        if (err.message.includes('Access denied')) {
            alert('Access Denied: You are not an Admin.');
            window.location.href = '/';
        }
    }
}

// Update Stock
window.updateStock = async (id) => {
    const stock = document.getElementById(`stock-${id}`).value;
    try {
        await apiFetch(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ stock: Number(stock) })
        });
        alert('Stock updated successfully');
    } catch (err) {
        alert('Failed to update stock: ' + err.message);
    }
};

// Add Product
document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('p-name').value;
    const price = document.getElementById('p-price').value;
    const imageUrl = document.getElementById('p-image').value;
    const description = document.getElementById('p-desc').value;

    try {
        await apiFetch('/products', {
            method: 'POST',
            body: JSON.stringify({ name, price, imageUrl, description, stock: 10 })
        });
        alert('Product added!');
        e.target.reset();
        loadAdminProducts();
    } catch (err) {
        alert(err.message);
    }
});

// Expose delete
window.deleteProduct = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
        await apiFetch(`/products/${id}`, { method: 'DELETE' });
        loadAdminProducts();
    } catch (err) {
        alert(err.message);
    }
};

let allOrders = []; // Store orders globally

// Load Orders
async function loadAdminOrders() {
    const container = document.getElementById('admin-orders');
    try {
        const orders = await apiFetch('/orders'); // Admin route
        allOrders = orders; // Save to global

        container.innerHTML = orders.map(order => `
      <div class="card" style="margin-bottom: 1rem; padding: 1rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem; align-items:center;">
            <strong>${order._id.slice(-6).toUpperCase()}</strong>
            <button class="btn-outline" onclick="viewOrder('${order._id}')" style="font-size:0.8rem; padding:2px 8px;">View Details</button>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.9rem; margin-bottom:0.5rem;">
            <span>${order.user?.name || 'Unknown User'}</span>
            <span>${order.items.length} Items</span>
        </div>
        <div style="margin-top:0.5rem; pt-2; border-top:1px solid #333; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-weight:bold;">₹${order.total}</span>
            <select onchange="updateStatus('${order._id}', this.value)" style="background:var(--glass-bg); color:white; border:1px solid var(--glass-border); padding:2px 5px; border-radius:5px;">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
        </div>
      </div>
    `).join('');
    } catch (err) {
        console.error(err);
        container.innerHTML = `<p style="color:red;">Error loading orders: ${err.message}</p>`;
    }
}

// View Order Details
window.viewOrder = (id) => {
    const order = allOrders.find(o => o._id === id);
    if (!order) return;

    const modal = document.getElementById('order-modal');
    const content = document.getElementById('modal-content');

    // Format Date
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    content.innerHTML = `
        <div class="detail-row">
            <div class="detail-group">
                <h4>Order ID</h4>
                <p style="font-family:monospace; font-size:1.1rem;">#${order._id.slice(-6).toUpperCase()}</p>
                <p class="text-small" style="margin-top:0.25rem;">${date}</p>
            </div>
            <div class="detail-group" style="text-align:right;">
                <h4>Status</h4>
                <span class="badge" style="background:var(--accent-color); color:black; padding:0.25rem 0.75rem; border-radius:20px; font-weight:bold; font-size:0.9rem;">
                    ${order.status.toUpperCase()}
                </span>
            </div>
        </div>

        <div class="detail-row">
             <div class="detail-group">
                <h4>Customer</h4>
                <p><strong>${order.user?.name || 'Guest'}</strong></p>
                <p>${order.user?.email || 'No email'}</p>
            </div>
             <div class="detail-group">
                <h4>Payment Method</h4>
                <p>${order.paymentMethod || 'COD'}</p>
            </div>
        </div>

        <div class="detail-group" style="margin-bottom: 1.5rem;">
            <h4>Shipping Address</h4>
            <div style="background:rgba(255,255,255,0.05); padding:1rem; border-radius:12px;">
                <p>${order.shippingAddress.line1}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zip}</p>
                <p>${order.shippingAddress.country}</p>
            </div>
        </div>

        <div class="detail-group">
            <h4>Ordered Items</h4>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="item-row">
                        <div style="display:flex; flex-direction:column;">
                            <span style="font-weight:600;">${item.name}</span>
                            <span style="font-size:0.85rem; opacity:0.7;">Qty: ${item.quantity}</span>
                        </div>
                        <span style="font-weight:600;">₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
                <div style="display:flex; justify-content:space-between; margin-top:1rem; padding-top:0.5rem; border-top:1px solid rgba(255,255,255,0.1); font-size:1.2rem; font-weight:700;">
                    <span>Total Amount</span>
                    <span style="color:var(--accent-color);">₹${order.total}</span>
                </div>
            </div>
        </div>
    `;

    // Show with animation class
    modal.classList.add('active');
};

window.closeModal = () => {
    document.getElementById('order-modal').classList.remove('active');
};
