import './style.css';
import { initTheme, toggleTheme } from './theme.js';

// Init theme
initTheme();
document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

// Parse URL parameters
const params = new URLSearchParams(window.location.search);
const login = params.get('login');
const user = params.get('user');

const loadingState = document.getElementById('loadingState');
const successState = document.getElementById('successState');
const errorState = document.getElementById('errorState');

if (login === 'success' && user) {
    // Login success
    loadingState.classList.add('hidden');
    successState.classList.remove('hidden');
    document.getElementById('userName').textContent = user;
    document.getElementById('goToCardLink').href = `/card.html?user=${encodeURIComponent(user)}`;

    // Auto redirect after 2 seconds
    setTimeout(() => {
        window.location.href = `/card.html?user=${encodeURIComponent(user)}`;
    }, 2000);
} else {
    // Login failed or invalid params
    loadingState.classList.add('hidden');
    errorState.classList.remove('hidden');
}
