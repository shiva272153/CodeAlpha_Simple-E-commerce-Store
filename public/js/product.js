import { apiFetch } from './api.js';
import { Store } from './store.js';

const id = new URLSearchParams(location.search).get('id');

// Elements
const container = document.getElementById('product-container');
const loading = document.getElementById('loading');
const errorContainer = document.getElementById('error-container');
const cartCount = document.getElementById('cart-count');

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    if (!id) {
        showError();
        return;
    }
    loadProduct(id);
});

function updateCartCount() {
    const count = Store.getCart().reduce((sum, i) => sum + i.quantity, 0);
    if (cartCount) cartCount.innerText = `(${count})`;
}

async function loadProduct(productId) {
    try {
        const product = await apiFetch(`/products/${productId}`);
        renderProduct(product);
    } catch (err) {
        console.error(err);
        showError();
    }
}

function showError() {
    loading.style.display = 'none';
    container.style.display = 'none';
    errorContainer.style.display = 'block';
}

function renderProduct(p) {
    // Populate Data
    document.getElementById('p-img').src = p.imageUrl || 'https://via.placeholder.com/600';
    document.getElementById('p-cat').innerText = p.category || 'Exclusive';
    document.getElementById('p-name').innerText = p.name;
    document.getElementById('p-desc').innerText = p.description || 'No description available for this exclusive item.';
    document.getElementById('p-price').innerText = `₹${p.price}`;

    // Actions
    document.getElementById('add-cart-btn').onclick = () => {
        Store.addToCart(p);
        updateCartCount();
    };

    document.getElementById('buy-now-btn').onclick = () => {
        Store.addToCart(p);
        window.location.href = 'cart.html';
    };

    // Show Container
    loading.style.display = 'none';
    container.style.display = 'block';
}
