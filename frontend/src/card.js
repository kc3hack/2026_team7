import './style.css';
import { initTheme, toggleTheme } from './theme.js';

// Init theme
initTheme();
document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

// Language color map
const LANG_COLORS = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3572a5',
    Go: '#00add8',
    Rust: '#dea584',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#239120',
    Ruby: '#701516',
    PHP: '#4f5d95',
    Swift: '#f05138',
    Kotlin: '#a97bff',
    Dart: '#00b4ab',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Lua: '#000080',
    Vim: '#199f4b',
    Makefile: '#427819',
    Dockerfile: '#384d54',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Scala: '#c22d40',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Nix: '#7e7eff',
    Zig: '#ec915c',
};

function getLangColor(name) {
    return LANG_COLORS[name] || '#8b8b8b';
}

function formatBytes(bytes) {
    if (bytes < 1000) return bytes + ' B';
    if (bytes < 1000000) return (bytes / 1000).toFixed(1) + ' KB';
    if (bytes < 1000000000) return (bytes / 1000000).toFixed(1) + ' MB';
    return (bytes / 1000000000).toFixed(1) + ' GB';
}

// URLバリデーション: http/https のみ許可
function isValidUrl(str) {
    try {
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

// Get user_name from URL
const params = new URLSearchParams(window.location.search);
const userName = params.get('user');

if (!userName) {
    showError('ユーザー名が指定されていません', 'URLにユーザー名パラメータが必要です。');
}

// Check if current user is logged in
let currentUser = null;
async function checkAuth() {
    try {
        const resp = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (resp.ok) {
            currentUser = await resp.json();
            updateHeaderAuth();
        } else {
            showLoginHeader();
        }
    } catch {
        showLoginHeader();
    }
}

function showLoginHeader() {
    document.getElementById('headerAuth').innerHTML = `
    <a href="/api/v1/auth/login"
       class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
              bg-gradient-to-r from-neon-blue to-neon-purple text-white
              hover:shadow-lg hover:shadow-neon-blue/30 transition-all duration-300">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
      ログイン
    </a>
  `;
}

function updateHeaderAuth() {
    if (!currentUser) return;
    const container = document.getElementById('headerAuth');
    container.innerHTML = '';

    const link = document.createElement('a');
    link.href = '/card.html?user=' + encodeURIComponent(currentUser.user_name);
    link.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm hover:bg-dark-600/50 transition-colors';

    const avatar = document.createElement('img');
    avatar.src = currentUser.avatar_url;
    avatar.alt = '';
    avatar.className = 'w-7 h-7 rounded-full border border-dark-500';
    link.appendChild(avatar);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'text-dark-100 font-medium';
    nameSpan.textContent = currentUser.user_name;
    link.appendChild(nameSpan);

    container.appendChild(link);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'px-3 py-1.5 rounded-xl text-xs text-dark-400 hover:text-white hover:bg-dark-600/50 transition-colors';
    logoutBtn.textContent = 'ログアウト';
    logoutBtn.addEventListener('click', () => window.logout());
    container.appendChild(logoutBtn);
}

window.logout = async function () {
    await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
};

function showError(title, msg) {
    document.getElementById('loadingContainer').classList.add('hidden');
    document.getElementById('cardContainer').classList.add('hidden');
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.classList.remove('hidden');
    errorContainer.classList.add('flex');
    document.getElementById('errorTitle').textContent = title;
    document.getElementById('errorMsg').textContent = msg;
}

// Animate stat ring
function animateRing(elementId, value, maxValue = 100) {
    const ring = document.getElementById(elementId);
    const circumference = 2 * Math.PI * 42; // r=42
    const offset = circumference - (value / maxValue) * circumference;
    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 200);
}

// Fetch and render card
async function loadCard() {
    if (!userName) return;

    try {
        const resp = await fetch(`/api/v1/cards/${encodeURIComponent(userName)}`, {
            credentials: 'include',
        });

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            if (resp.status === 404) {
                // Check if this is the logged-in user who just hasn't created a card yet
                if (currentUser && currentUser.user_name === userName) {
                    showNoCardYet();
                } else {
                    showError('カードが見つかりません', err.error || 'このユーザーのカードは未作成です。');
                }
            } else {
                showError('エラーが発生しました', err.error || '不明なエラー');
            }
            return;
        }

        const data = await resp.json();
        renderCard(data);
    } catch (e) {
        console.error('Failed to load card:', e);
        showError('通信エラー', 'サーバーに接続できません。');
    }
}

function renderCard(data) {
    const { user_info, card_info } = data;

    // Hide loading, show card
    document.getElementById('loadingContainer').classList.add('hidden');
    document.getElementById('cardContainer').classList.remove('hidden');

    // Update page title
    document.title = `${user_info.display_name || user_info.user_name} - Engineer Card`;

    // Profile
    document.getElementById('avatarImg').src = user_info.avatar_url;
    document.getElementById('displayName').textContent = user_info.display_name || user_info.user_name;
    document.getElementById('userNameDisplay').textContent = '@' + user_info.user_name;
    document.getElementById('aliasTitle').textContent = '『' + card_info.alias_title + '』';
    document.getElementById('bioText').textContent = user_info.bio || '';

    // Card title
    document.getElementById('cardTitle').textContent = user_info.display_name || user_info.user_name;
    document.getElementById('techLevelBadge').textContent = 'Lv.' + card_info.technical_level;

    // Profile details (DOM構築でXSS対策)
    const details = [];
    if (user_info.company) details.push({ icon: '🏢', text: user_info.company });
    if (user_info.location) details.push({ icon: '📍', text: user_info.location });
    if (user_info.website) details.push({ icon: '🔗', text: user_info.website });

    const detailsEl = document.getElementById('profileDetails');
    detailsEl.innerHTML = '';
    details.forEach((d) => {
        const row = document.createElement('div');
        row.className = 'flex items-center gap-2 text-dark-300';
        const iconSpan = document.createElement('span');
        iconSpan.textContent = d.icon;
        const textSpan = document.createElement('span');
        textSpan.className = 'truncate';
        textSpan.textContent = d.text;
        row.appendChild(iconSpan);
        row.appendChild(textSpan);
        detailsEl.appendChild(row);
    });

    // Social accounts (URLバリデーション + DOM構築でXSS対策)
    const socialEl = document.getElementById('socialLinks');
    socialEl.innerHTML = '';
    if (user_info.social_accounts && user_info.social_accounts.length > 0) {
        user_info.social_accounts.forEach((acc) => {
            if (!isValidUrl(acc.url)) return; // http/https以外は無視
            const a = document.createElement('a');
            a.href = acc.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.className = 'text-dark-300 hover:text-neon-blue transition-colors text-xs underline truncate max-w-[150px] inline-block';
            a.textContent = acc.url.replace(/^https?:\/\/(www\.)?/, '');
            socialEl.appendChild(a);
        });
    }

    // Stats rings
    document.getElementById('techValue').textContent = card_info.technical_level;
    document.getElementById('activityValue').textContent = card_info.activity_score;
    document.getElementById('charmValue').textContent = card_info.charm_score;

    animateRing('techRing', card_info.technical_level);
    animateRing('activityRing', card_info.activity_score);
    animateRing('charmRing', card_info.charm_score);

    // Stats
    document.getElementById('repoCount').textContent = card_info.stats.repo_count;
    document.getElementById('totalCode').textContent = formatBytes(card_info.stats.total_char_count);

    // Dates
    document.getElementById('lastUpdated').textContent = new Date(card_info.last_updated_at).toLocaleDateString('ja-JP');
    document.getElementById('githubJoinedAt').textContent = user_info.github_joined_at;

    // Languages
    renderLanguages(card_info.languages, card_info.stats.total_char_count);

    // Show actions if self
    if (user_info.is_self) {
        document.getElementById('actionsContainer').classList.remove('hidden');
    }
}

function renderLanguages(languages, totalBytes) {
    const container = document.getElementById('languagesContainer');
    container.innerHTML = '';

    if (!languages || languages.length === 0) {
        const p = document.createElement('p');
        p.className = 'text-dark-400 text-sm';
        p.textContent = '言語データがありません';
        container.appendChild(p);
        return;
    }

    // Show top 10
    const top = languages.slice(0, 10);
    top.forEach((lang, i) => {
        const percent = totalBytes > 0 ? ((lang.char_count / totalBytes) * 100).toFixed(1) : 0;
        const color = getLangColor(lang.name);

        const wrapper = document.createElement('div');
        wrapper.className = 'animate-slide-in-right';
        wrapper.style.animationDelay = `${i * 0.05}s`;

        const header = document.createElement('div');
        header.className = 'flex items-center justify-between mb-1';

        const nameGroup = document.createElement('div');
        nameGroup.className = 'flex items-center gap-2';
        const colorDot = document.createElement('span');
        colorDot.className = 'w-3 h-3 rounded-full inline-block';
        colorDot.style.backgroundColor = color;
        const nameSpan = document.createElement('span');
        nameSpan.className = 'text-sm font-medium text-white';
        nameSpan.textContent = lang.name;
        nameGroup.appendChild(colorDot);
        nameGroup.appendChild(nameSpan);

        const statsGroup = document.createElement('div');
        statsGroup.className = 'flex items-center gap-3 text-xs text-dark-300';
        const bytesSpan = document.createElement('span');
        bytesSpan.textContent = formatBytes(lang.char_count);
        const percentSpan = document.createElement('span');
        percentSpan.className = 'font-semibold text-dark-200';
        percentSpan.textContent = percent + '%';
        statsGroup.appendChild(bytesSpan);
        statsGroup.appendChild(percentSpan);

        header.appendChild(nameGroup);
        header.appendChild(statsGroup);

        const barBg = document.createElement('div');
        barBg.className = 'h-2 bg-dark-700 rounded-full overflow-hidden';
        const barFill = document.createElement('div');
        barFill.className = 'h-full rounded-full skill-bar-fill';
        barFill.style.width = percent + '%';
        barFill.style.backgroundColor = color;
        barBg.appendChild(barFill);

        wrapper.appendChild(header);
        wrapper.appendChild(barBg);
        container.appendChild(wrapper);
    });
}

// Update card
document.getElementById('updateBtn')?.addEventListener('click', async () => {
    const modal = document.getElementById('updateModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    try {
        const resp = await fetch(`/api/v1/cards/${encodeURIComponent(userName)}/update`, {
            method: 'POST',
            credentials: 'include',
        });

        modal.classList.add('hidden');
        modal.classList.remove('flex');

        if (resp.ok) {
            // Reload card
            document.getElementById('cardContainer').classList.add('hidden');
            document.getElementById('loadingContainer').classList.remove('hidden');
            loadCard();
        } else {
            const err = await resp.json().catch(() => ({}));
            alert('更新に失敗しました: ' + (err.error || '不明なエラー'));
        }
    } catch (e) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        alert('通信エラーが発生しました');
    }
});

// QR code
document.getElementById('qrBtn')?.addEventListener('click', () => {
    const modal = document.getElementById('qrModal');
    const img = document.getElementById('qrImage');
    img.src = `/api/v1/cards/${encodeURIComponent(userName)}/qr`;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
});

document.getElementById('closeQrModal')?.addEventListener('click', () => {
    const modal = document.getElementById('qrModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
});

// Close modals on backdrop click
document.getElementById('qrModal')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.add('hidden');
        e.currentTarget.classList.remove('flex');
    }
});

// Show "no card yet" state with auto-create option
async function showNoCardYet() {
    document.getElementById('loadingContainer').classList.add('hidden');
    document.getElementById('cardContainer').classList.add('hidden');
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.classList.remove('hidden');
    errorContainer.classList.add('flex');
    document.getElementById('errorTitle').textContent = 'カードがまだ作成されていません';
    document.getElementById('errorMsg').innerHTML = `
        <p class="mb-4">GitHubのデータからスキルカードを自動生成します。</p>
        <button id="createCardBtn"
                class="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                       bg-gradient-to-r from-neon-blue to-neon-purple text-white
                       hover:shadow-lg hover:shadow-neon-blue/30 transform hover:scale-105 transition-all duration-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            カードを作成する
        </button>
    `;

    document.getElementById('createCardBtn')?.addEventListener('click', async () => {
        // Show loading
        errorContainer.classList.add('hidden');
        errorContainer.classList.remove('flex');
        document.getElementById('loadingContainer').classList.remove('hidden');
        document.getElementById('loadingContainer').querySelector('p').textContent = 'カードを作成中... GitHubからデータを取得しています（少し時間がかかります）';

        try {
            const resp = await fetch(`/api/v1/cards/${encodeURIComponent(userName)}/update`, {
                method: 'POST',
                credentials: 'include',
            });
            if (resp.ok) {
                loadCard();
            } else {
                const err = await resp.json().catch(() => ({}));
                showError('カード作成に失敗しました', err.error || '不明なエラー');
            }
        } catch {
            showError('通信エラー', 'サーバーに接続できません。');
        }
    });
}

// Init - await auth check before loading card
async function init() {
    await checkAuth();
    if (userName) {
        loadCard();
    }
}
init();
