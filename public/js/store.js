export const Store = {
    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch { return null; }
    },

    setUser(user, token) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
        window.dispatchEvent(new Event('auth-change'));
    },

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('auth-change'));
    },

    getCart() {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch { return []; }
    },

    addToCart(product) {
        const cart = this.getCart();
        const existing = cart.find(i => i.product === product._id);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                product: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-change'));
        alert(`Added ${product.name} to cart`);
    },

    updateCartQty(idx, qty) {
        const cart = this.getCart();
        if (qty < 1) return;
        cart[idx].quantity = Number(qty);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-change'));
    },

    removeFromCart(idx) {
        const cart = this.getCart();
        cart.splice(idx, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-change'));
    },

    clearCart() {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-change'));
    }
};
