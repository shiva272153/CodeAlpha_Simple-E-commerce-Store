import { apiFetch } from './api.js';
import { Store } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getUser();
    if (!user) {
        alert('Please login to checkout');
        window.location.href = 'login.html';
        return;
    }

    const cart = Store.getCart();
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    renderSummary(cart);

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const shippingAddress = {
            line1: document.getElementById('line1').value,
            line2: document.getElementById('line2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip: document.getElementById('zip').value,
            country: document.getElementById('country').value
        };

        // Payment Data
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        let paymentDetails = {};

        if (paymentMethod === 'Card') {
            paymentDetails = {
                number: document.getElementById('card-number').value.slice(-4), // Simulate keeping last 4 only
                expiry: document.getElementById('card-expiry').value
            };
        } else if (paymentMethod === 'UPI') {
            paymentDetails = {
                upiId: document.getElementById('upi-id').value
            };
        }

        try {
            const res = await apiFetch('/orders', {
                method: 'POST',
                body: JSON.stringify({ items: cart, shippingAddress, paymentMethod, paymentDetails })
            });

            alert('Order Placed Successfully! 🎉');
            Store.clearCart();
            window.location.href = 'orders.html'; // Redirect to history
        } catch (err) {
            console.error(err);
            alert('Order failed: ' + err.message);
        }
    });
});

// Expose toggle function
window.togglePayment = (method) => {
    document.querySelectorAll('.payment-section').forEach(el => el.style.display = 'none');
    document.getElementById(`payment-${method}`).style.display = 'block';
};

function renderSummary(cart) {
    const container = document.getElementById('order-items');
    let total = 0;

    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
                <span>${item.name} (x${item.quantity})</span>
                <span>₹${itemTotal}</span>
            </div>
        `;
    }).join('');

    document.getElementById('order-total').innerText = `₹${total}`;
}
