export const API_URL = '/api';

export async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });

    const text = await response.text();
    try {
        const data = JSON.parse(text);
        if (!response.ok) {
            throw new Error(data.msg || data.message || 'Something went wrong');
        }
        return data;
    } catch (e) {
        console.error('API Error:', text); // Log the HTML to console
        throw new Error(`Server returned: ${text.substring(0, 50)}...`);
    }
}
