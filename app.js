function getGamesPerPage() {
    const width = window.innerWidth;
    if (width <= 480) return 4;  // Small phones
    if (width <= 768) return 6;  // Tablets/large phones
    if (width <= 1024) return 8; // Small desktops
    return 12; // Large screens
}

let gamesPerPage = getGamesPerPage();
let currentPage = 1;
let currentFilters = {
    searchTerm: '',
    activeTags: []
};

function detectLanguage() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    if (lang && supportedLanguages.includes(lang)) return lang;
    // Try localStorage next
    lang = localStorage.getItem('lang');
    if (lang && supportedLanguages.includes(lang)) return lang;
    // Try browser language
    lang = navigator.language ? navigator.language.substr(0, 2) : 'en';
    if (supportedLanguages.includes(lang)) return lang;
    return 'en';
}

let currentLang = detectLanguage();

function setLanguage(lang) {
    if (!supportedLanguages.includes(lang)) lang = 'en';
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Remove lang param from URL so it doesn't override user choice on reload
    const url = new URL(window.location.href);
    if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang');
        window.history.replaceState({}, '', url.toString());
    }

    updateUIText();
    renderTagCloud();
    applyFilters();
    renderPagination();

    // Update theme selector to reflect new language
    updateThemeSelector();
}

function updateUIText() {
    const t = translations[currentLang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('title_banner').textContent = t.title_banner;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder;
    document.getElementById('searchBtn').textContent = t.search;
    document.getElementById('resetBtn').textContent = t.reset;
    // Update theme selector to reflect new language
    updateThemeSelector();
    // Update pagination and recommendations via rerender
}

function updateThemeSelector() {
    const oldSel = document.getElementById('themeSelector');
    if (oldSel) {
        const controls = oldSel.parentNode;
        const currentValue = oldSel.value;
        controls.removeChild(oldSel);
        const newSel = createThemeSelector();
        newSel.value = currentValue;
        controls.appendChild(newSel);
    }
}

function createLanguageSelector() {
    const sel = document.createElement('select');
    sel.id = 'langSelector';
    supportedLanguages.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l;
        opt.textContent = l.toUpperCase();
        if (l === currentLang) opt.selected = true;
        sel.appendChild(opt);
    });
    sel.onchange = () => setLanguage(sel.value);
    return sel;
}

// --- Theme Preference ---
function saveThemePreference(theme) {
    localStorage.setItem('theme', theme);
}
function getThemePreference() {
    return localStorage.getItem('theme');
}

function createThemeSelector() {
    const sel = document.createElement('select');
    sel.id = 'themeSelector';
    const themes = (window.themeConfig && window.themeConfig.availableThemes) || [
        { value: "default", label: "Default" }
    ];
    const t = translations[currentLang];
    const currentTheme = getThemeFromURLorStorage();
    themes.forEach(themeObj => {
        const opt = document.createElement('option');
        opt.value = themeObj.value;
        // Use translation if available, fallback to config label
        opt.textContent = (t.themeNames && t.themeNames[themeObj.value]) || themeObj.label || themeObj.value;
        if (themeObj.value === currentTheme) opt.selected = true;
        sel.appendChild(opt);
    });
    sel.onchange = () => {
        setTheme(sel.value);
    };
    return sel;
}

function setTheme(theme) {
    saveThemePreference(theme);
    // Remove all theme links
    document.querySelectorAll('link[rel=stylesheet]').forEach(link => {
        if (link.href.includes('themes/') || link.href.endsWith('styles.css')) {
            link.parentNode.removeChild(link);
        }
    });
    // Add new theme link
    const cssFile = theme === 'default' ? 'styles.css' : `themes/${theme}.css`;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssFile;
    link.onerror = function() {
        // Fallback to default theme if theme file doesn't exist
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = 'styles.css';
        document.head.appendChild(fallbackLink);
    };
    document.head.appendChild(link);
    // Optionally, trigger a UI refresh if needed
    // Remove theme param from URL so it doesn't override user choice on reload
    const url = new URL(window.location.href);
    if (url.searchParams.has('theme')) {
        url.searchParams.delete('theme');
        window.history.replaceState({}, '', url.toString());
    }
}

function getThemeFromURLorStorage() {
    const urlParams = new URLSearchParams(window.location.search);
    let theme = urlParams.get('theme');
    if (!theme) theme = getThemePreference();
    if (!theme && window.themeConfig) theme = window.themeConfig.defaultTheme;
    return theme || 'default';
}

// --- Patch init to add language and theme selector and load preferences ---
function init() {
    // Add language selector to controls
    const controls = document.querySelector('.controls');
    if (!document.getElementById('langSelector')) {
        controls.appendChild(createLanguageSelector());
    }
    // Add theme selector to controls
    if (!document.getElementById('themeSelector')) {
        controls.appendChild(createThemeSelector());
    }
    // Set theme preference if not set
    let theme = getThemeFromURLorStorage();
    saveThemePreference(theme);
    setTheme(theme);
    renderTagCloud();
    displayGames(gameDatabase);
    renderPagination();
    updateUIText();
}

function renderTagCloud() {
    const t = translations[currentLang];
    const allTags = [...new Set(gameDatabase.flatMap(g => g.tags))];
    const container = document.getElementById('tagCloud');
    container.innerHTML = allTags.map(tag => {
        const isActive = currentFilters.activeTags.includes(tag);
        // Always use the tag key for filtering, but show translated label
        const tagLabel = (t.tagNames && t.tagNames[tag]) || tag;
        // Use data-tag for the original tag key
        return `<span class="tag ${isActive ? 'active' : ''}" data-tag="${tag}" onclick="toggleTagFilter('${tag}')">${tagLabel}</span>`;
    }).join('');
}

function toggleTagFilter(tag) {
    const index = currentFilters.activeTags.indexOf(tag);
    if (index === -1) {
        currentFilters.activeTags.push(tag);
    } else {
        currentFilters.activeTags.splice(index, 1);
    }
    applyFilters();
}

function resetFilters() {
    currentFilters = { searchTerm: '', activeTags: [] };
    document.getElementById('searchInput').value = '';
    applyFilters();
}

function searchGames() {
    currentFilters.searchTerm = document.getElementById('searchInput').value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    const tLang = currentLang;
    const results = gameDatabase.filter(game => {
        // Use translated name/author if available, fallback to default
        const name = (game.name_i18n && game.name_i18n[tLang]) || game.name || "";
        const author = (game.author_i18n && game.author_i18n[tLang]) || game.author || "";
        const matchesSearch =
            name.toLowerCase().includes(currentFilters.searchTerm) ||
            author.toLowerCase().includes(currentFilters.searchTerm);
        const matchesTags =
            currentFilters.activeTags.length === 0 ||
            currentFilters.activeTags.every(tag => game.tags.includes(tag));
        return matchesSearch && matchesTags;
    });
    displayGames(results);
    renderPagination(results.length);
    renderTagCloud(); // Re-render tag cloud to update active states
}

function displayGames(games) {
    const t = translations[currentLang];
    const tLang = currentLang;
    const startIdx = (currentPage - 1) * gamesPerPage;
    const paginatedGames = games.slice(startIdx, startIdx + gamesPerPage);

    document.getElementById('gameList').innerHTML = paginatedGames.map(game => {
        // Translate tags for display using tag key
        const tagLabels = game.tags.map(tag => (t.tagNames && t.tagNames[tag]) || tag);
        // Use translated name/author if available
        const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
        const author = (game.author_i18n && game.author_i18n[tLang]) || game.author;
        return `
        <div class="game-card" onclick="loadGame(${game.id})">
            <h3>${name}</h3>
            <p>${t.by} ${author} (${game.email})</p>
            <p>${t.tags}: ${tagLabels.join(', ')}</p>
        </div>
        `;
    }).join('');
}

function renderPagination(totalGames = gameDatabase.length) {
    const t = translations[currentLang];
    gamesPerPage = getGamesPerPage(); // Update games per page based on current screen size
    const pageCount = Math.ceil(totalGames / gamesPerPage);
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            ${t.previous}
        </button>
    `;
    
    // Page input and total pages
    paginationHTML += `
        <div class="page-info">
            ${t.page} 
            <input type="number" 
                   id="pageInput" 
                   value="${currentPage}" 
                   min="1" 
                   max="${pageCount}"
                   onchange="jumpToPage(this.value)"
                   onkeypress="handlePageInputKeypress(event)">
            ${t.of} ${pageCount}
        </div>
    `;
    
    // Next button
    paginationHTML += `
        <button class="page-btn ${currentPage === pageCount ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === pageCount ? 'disabled' : ''}>
            ${t.next}
        </button>
    `;
    
    document.getElementById('pagination').innerHTML = paginationHTML;
}

function changePage(page) {
    const totalGames = gameDatabase.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(currentFilters.searchTerm) || 
                            game.author.toLowerCase().includes(currentFilters.searchTerm);
        const matchesTags = currentFilters.activeTags.length === 0 || 
                          currentFilters.activeTags.every(tag => game.tags.includes(tag));
        return matchesSearch && matchesTags;
    }).length;
    const pageCount = Math.ceil(totalGames / gamesPerPage);
    
    if (page >= 1 && page <= pageCount) {
        currentPage = page;
        applyFilters();
    }
}

function jumpToPage(page) {
    const pageNum = parseInt(page, 10);
    if (!isNaN(pageNum)) {
        changePage(pageNum);
    }
}

function handlePageInputKeypress(event) {
    if (event.key === 'Enter') {
        jumpToPage(event.target.value);
    }
}

function loadGame(id) {
    const game = gameDatabase.find(g => g.id === id);
    document.getElementById('gameFrame').src = game.url;
    document.getElementById('fullscreenOverlay').style.display = 'flex';
    showRecommendations(id);
}

function showRecommendations(gameId) {
    const t = translations[currentLang];
    const tLang = currentLang;
    const recs = getRecommendedGames(gameId);
    document.getElementById('recommendations').innerHTML = `
        <h3>${t.recommended}</h3>
        ${recs.map(game => {
            // Translate tags for recommendations using tag key
            const tagLabels = game.tags.map(tag => (t.tagNames && t.tagNames[tag]) || tag);
            // Use translated name if available
            const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
            return `
            <div class="rec-item" onclick="loadGame(${game.id})">
                ${name} (${tagLabels.join(', ')})
            </div>
            `;
        }).join('')}
    `;
}

function closeFrame() {
    document.getElementById('fullscreenOverlay').style.display = 'none';
    document.getElementById('gameFrame').src = '';
}

window.onload = init;

// Add resize listener to update games per page
window.addEventListener('resize', function() {
    const newGamesPerPage = getGamesPerPage();
    if (newGamesPerPage !== gamesPerPage) {
        gamesPerPage = newGamesPerPage;
        // Reset to first page and reapply filters
        currentPage = 1;
        applyFilters();
    }
});

// Expose setLanguage and setTheme for HTML
window.setLanguage = setLanguage;
window.setTheme = setTheme;
