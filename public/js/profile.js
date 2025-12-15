import { Store } from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getUser();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load Profile Data
    document.getElementById('p-name').value = user.name;
    document.getElementById('p-email').value = user.email;

    // Handle Form Submit
    document.getElementById('profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('p-name').value;

        // Simulating Update - in real app would call API PATCH /users/me
        user.name = newName;
        Store.setUser(user, localStorage.getItem('token'));
        alert('Profile Updated Successfully!');
        window.location.reload();
    });

    // Check URL Param for Tab
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('tab') === 'address') {
        showTab('address');
    }
});

window.showTab = (tabName) => {
    document.getElementById('tab-profile').style.display = 'none';
    document.getElementById('tab-address').style.display = 'none';

    document.getElementById(`tab-${tabName}`).style.display = 'block';
};
