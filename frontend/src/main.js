import './style.css';
import { initTheme, toggleTheme } from './theme.js';

// Init theme
initTheme();
document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

// Search functionality
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function performSearch() {
    const userName = searchInput.value.trim();
    if (userName) {
        window.location.href = `/card.html?user=${encodeURIComponent(userName)}`;
    }
}

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Check if user is already logged in
async function checkAuth() {
    try {
        const resp = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (resp.ok) {
            const data = await resp.json();
            const loginBtn = document.getElementById('loginBtn');
            loginBtn.href = `/card.html?user=${encodeURIComponent(data.user_name)}`;
            loginBtn.innerHTML = `
        <img src="${data.avatar_url}" alt="" class="w-6 h-6 rounded-full" />
        マイカードを見る
        <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      `;
        }
    } catch {
        // Not logged in - keep default button
    }
}

checkAuth();
