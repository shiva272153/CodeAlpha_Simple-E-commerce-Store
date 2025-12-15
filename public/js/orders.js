import { apiFetch } from './api.js';

document.addEventListener('DOMContentLoaded', loadOrders);

async function loadOrders() {
    const container = document.getElementById('orders-list');
    try {
        const orders = await apiFetch('/orders/my');

        if (orders.length === 0) {
            container.innerHTML = '<p>No orders found. Go shop!</p><a href="/" class="btn mt-4">Start Shopping</a>';
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="card" style="margin-bottom: 2rem; padding: 1.5rem;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <div>
                        <span style="font-size: 0.9rem; opacity: 0.7;">Order ID</span>
                        <div>#${order._id.slice(-6).toUpperCase()}</div>
                    </div>
                    <div class="text-right">
                        <span style="font-size: 0.9rem; opacity: 0.7;">Total</span>
                        <div style="font-weight: bold;">₹${order.total}</div>
                    </div>
                </div>
                <div>
                     ${order.items.map(item => `
                        <div style="display:flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem;">
                            <span>${item.name} <span style="opacity:0.6;">x${item.quantity}</span></span>
                            <span>₹${item.price * item.quantity}</span>
                        </div>
                     `).join('')}
                </div>
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--glass-border); display:flex; justify-content: space-between; align-items: center;">
                    <span class="badge" style="background: ${order.status === 'pending' ? 'var(--warning)' : 'var(--success)'}; color: #000; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600;">
                        ${order.status.toUpperCase()}
                    </span>
                    <span style="font-size: 0.8rem; opacity: 0.6;">${new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap;">
                    <a href="track.html?id=${order._id}" class="btn" style="flex:1; text-align:center; font-size:0.9rem; text-decoration:none;">Track Package</a>
                    <a href="order-details.html?id=${order._id}" class="btn-outline" style="flex:1; text-align:center; font-size:0.9rem; text-decoration:none; padding: 0.5rem;">View Order</a>
                    <button onclick="alert('Review feature coming soon!')" class="btn-outline" style="flex:1; font-size:0.9rem;">Write Review</button>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Error loading orders.</p>';
    }
}
