const API = '/api';

async function loadProducts() {
  const res = await fetch(`${API}/products`);
  const products = await res.json();
  const root = document.getElementById('products');
  root.innerHTML = products.map(p => `
    <div class="card">
      <img src="${p.imageUrl || 'https://via.placeholder.com/300'}" alt="${p.name}" style="width:100%; height:160px; object-fit:cover;" />
      <h3>${p.name}</h3>
      <p>₹${p.price}</p>
      <button class="btn" onclick="location.href='/product.html?id=${p._id}'">View</button>
      <button class="btn" onclick='addToCart(${JSON.stringify({product:p._id,name:p.name,price:p.price,quantity:1})})'>Add to cart</button>
    </div>
  `).join('');
}

async function loadProduct(id) {
  const res = await fetch(`${API}/products/${id}`);
  const p = await res.json();
  const root = document.getElementById('product');
  root.innerHTML = `
    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:2rem;">
      <img src="${p.imageUrl || 'https://via.placeholder.com/600'}" alt="${p.name}" style="width:100%; border-radius:8px;" />
      <div>
        <h2>${p.name}</h2>
        <p>${p.description || ''}</p>
        <h3>Price: ₹${p.price}</h3>
        <button class="btn" onclick='addToCart(${JSON.stringify({product:p._id,name:p.name,price:p.price,quantity:1})})'>Add to cart</button>
      </div>
    </div>
  `;
}

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.product === item.product);
  if (idx !== -1) cart[idx].quantity += item.quantity;
  else cart.push(item);
  saveCart(cart);
  alert('Added to cart');
}

function renderCart() {
  const cart = getCart();
  const root = document.getElementById('cart-items');
  if (!cart.length) return root.innerHTML = '<p>Your cart is empty.</p>';
  root.innerHTML = cart.map((i, idx) => `
    <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong>${i.name}</strong><br />
        ₹${i.price} × 
        <input type="number" min="1" value="${i.quantity}" onchange="updateQty(${idx}, this.value)" style="width:60px;" />
      </div>
      <button class="btn" onclick="removeItem(${idx})">Remove</button>
    </div>
  `).join('');
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  document.getElementById('cart-total').innerText = `Total: ₹${total}`;
}

function updateQty(idx, qty) {
  const cart = getCart();
  cart[idx].quantity = Number(qty);
  saveCart(cart);
  renderCart();
}

function removeItem(idx) {
  const cart = getCart();
  cart.splice(idx, 1);
  saveCart(cart);
  renderCart();
}

function clearCart() {
  localStorage.removeItem('cart');
  renderCart();
}