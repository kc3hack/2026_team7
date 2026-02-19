// Theme handling
const THEME_KEY = 'engineercontrol_theme';

export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateToggleIcon('light');
    } else {
        document.documentElement.removeAttribute('data-theme');
        updateToggleIcon('dark');
    }
}

export function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem(THEME_KEY, newTheme);
    updateToggleIcon(newTheme);
}

function updateToggleIcon(theme) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;

    // Update icon based on theme
    // Sun icon for light mode (to switch to dark), Moon icon for dark mode (to switch to light)
    // Actually usually you show the icon of the current mode or the mode you will switch to.
    // Let's show the "Sun" when in Dark mode (click to go Light)
    // And "Moon" when in Light mode (click to go Dark)

    if (theme === 'light') {
        // Show Moon (switch to dark)
        btn.innerHTML = `
      <svg class="w-6 h-6 text-dark-500 hover:text-neon-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    `;
    } else {
        // Show Sun (switch to light)
        btn.innerHTML = `
      <svg class="w-6 h-6 text-yellow-400 hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    `;
    }
}
