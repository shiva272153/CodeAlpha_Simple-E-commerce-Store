import { apiFetch } from './api.js';
import { Store } from './store.js';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const data = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            Store.setUser(data.user, data.token);
            window.location.href = '/';
        } catch (err) {
            alert(err.message);
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } catch (err) {
            alert(err.message);
        }
    });
}
