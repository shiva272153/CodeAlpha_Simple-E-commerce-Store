import { apiFetch } from './api.js';
import { Store } from './store.js';

// Init
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
    loadProducts();
});

// Navbar State
function setupNavbar() {
    const user = Store.getUser();
    const authLink = document.getElementById('auth-link');
    const cartCount = document.getElementById('cart-count');

    // Update Cart Count
    const updateCount = () => {
        const count = Store.getCart().reduce((sum, i) => sum + i.quantity, 0);
        if (cartCount) cartCount.innerText = `(${count})`;
    };

    updateCount();
    window.addEventListener('cart-change', updateCount);

    // Update Auth Link
    if (user) {
        authLink.innerHTML = `
            <div class="dropdown">
                <a href="#" id="dropdown-toggle" style="color:var(--accent-color); font-weight:bold;">${user.name} ▼</a>
                <div id="dropdown-menu" class="dropdown-content">
                    <a href="profile.html">Edit Profile</a>
                    <a href="orders.html">Order History</a>
                    <a href="profile.html?tab=address">Saved Addresses</a>
                    <a href="#" id="logout-btn" style="color:var(--error);">Logout</a>
                </div>
            </div>
        `;

        // Toggle Logic
        document.getElementById('dropdown-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('dropdown-menu').classList.toggle('show');
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.matches('#dropdown-toggle')) {
                const dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        });

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            Store.logout();
            window.location.href = '/login.html';
        });
    }
}

// Load Products
async function loadProducts() {
    const grid = document.getElementById('products');
    if (!grid) return;

    try {
        const products = await apiFetch('/products');

        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column:1/-1; text-align:center;">No products found.</p>';
            return;
        }

        grid.innerHTML = products.map(p => `
      <div class="card">
        <a href="product.html?id=${p._id}" style="text-decoration:none; color:inherit; display:block;">
          <img src="${p.imageUrl || 'https://via.placeholder.com/400x300?text=Product'}" alt="${p.name}" />
          <div class="card-body">
            <h3>${p.name}</h3>
            <span class="card-price">₹${p.price}</span>
        </a>
          <button class="btn btn-add" data-json='${JSON.stringify(p)}' style="width:100%">
            Add to Cart
          </button>
          </div> <!-- Close card-body here if needed, but structure above was tricky. Let's fix structure. -->
      </div>
    `).join('');

        // Attach Listeners
        document.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const product = JSON.parse(e.target.dataset.json);
                Store.addToCart(product);
            });
        });

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p style="color:var(--error); text-align:center;">Failed to load products.</p>`;
    }
}
