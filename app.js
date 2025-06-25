function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isTouchDevice() {
    return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}
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
    activeTags: [],
    sortBy: 'name', // 'name' or 'updated'
    sortDir: 'asc'  // 'asc' or 'desc'
};

function detectLanguage() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    if (lang && supportedLanguages.includes(lang)) return lang;
    if (lang && !supportedLanguages.includes(lang)) {
        window._showLangThemeWarning = true;
    }
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
    const langSelector = document.getElementById('langSelector');
    if(langSelector) {
        langSelector.value = lang;
    }
    updateUIText();
    renderTagCloud();
    applyFilters();
    renderPagination();

    // Update theme selector to reflect new language
    updateThemeSelector();

    // Render notices in new language
    renderNotices();

    // Ensure recently played and favourites sections update language immediately
    renderFavouritesSection();
    renderRecentlyPlayedSection();

    // Update open game window titles to new language
    updateOpenGameWindowTitles();
}

// Update titles of open game windows when language changes
function updateOpenGameWindowTitles() {
    const tLang = currentLang;
    Object.values(openGameWindows).forEach(({win, game}) => {
        const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
        const titleSpan = win.querySelector('.game-window-title');
        if (titleSpan) titleSpan.textContent = name;
    });
}

// function updateUIText() {
//     const t = translations[currentLang];
//     document.getElementById('title').textContent = t.title;
//     document.getElementById('title_banner').textContent = t.title_banner;
//     document.getElementById('searchInput').placeholder = t.searchPlaceholder;
//     document.getElementById('searchBtn').textContent = t.search;
//     document.getElementById('resetBtn').textContent = t.reset;
//     document.getElementById('importBtn').textContent = t.importData;
//     document.getElementById('exportBtn').textContent = t.exportData;
//     // Timer controls
//     updateTimerUIText();
//     // Update theme selector to reflect new language
//     updateThemeSelector();
//     // Update pagination and recommendations via rerender

//     // Update sort controls
//     const sortBySel = document.getElementById('sortBySelect');
//     const sortDirSel = document.getElementById('sortDirSelect');
//     if (sortBySel && sortDirSel) {
//         sortBySel.options[0].textContent = t.sortByName || 'Name';
//         sortBySel.options[1].textContent = t.sortByUpdated || 'Last Updated';
//         sortDirSel.options[0].textContent = t.ascending || 'Ascending';
//         sortDirSel.options[1].textContent = t.descending || 'Descending';
//     }
// }

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

    // --- Group themes by tag ---
    let tagNames = {};
    if (window.themeConfig && window.themeConfig.tagNames) {
        tagNames = window.themeConfig.tagNames[currentLang] || window.themeConfig.tagNames.en || {};
    }
    // Build tag->themes map
    const tagMap = {};
    themes.forEach(themeObj => {
        const tags = Array.isArray(themeObj.tags) ? themeObj.tags : ["other"];
        tags.forEach(tag => {
            if (!tagMap[tag]) tagMap[tag] = [];
            tagMap[tag].push(themeObj);
        });
    });
    // Sort tags alphabetically by localized name
    const sortedTags = Object.keys(tagMap).sort((a, b) => {
        const an = tagNames[a] || a;
        const bn = tagNames[b] || b;
        return an.localeCompare(bn);
    });
    // Render optgroups
    sortedTags.forEach(tag => {
        const group = document.createElement('optgroup');
        group.label = tagNames[tag] || tag;
        tagMap[tag].forEach(themeObj => {
            const opt = document.createElement('option');
            opt.value = themeObj.value;
            // Use translation if available, fallback to config label
            opt.textContent = (t.themeNames && t.themeNames[themeObj.value]) || themeObj.label || themeObj.value;
            if (themeObj.value === currentTheme) opt.selected = true;
            group.appendChild(opt);
        });
        sel.appendChild(group);
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
        window._showLangThemeWarning = true;
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = 'styles.css';
        document.head.appendChild(fallbackLink);
        // Re-render notices to show warning
        if (typeof renderNotices === "function") setTimeout(renderNotices, 0);
    };
    document.head.appendChild(link);

    // --- Theme JS support ---
    // Find theme config
    let themeObj = null;
    if (window.themeConfig && Array.isArray(window.themeConfig.availableThemes)) {
        themeObj = window.themeConfig.availableThemes.find(t => t.value === theme);
    }
    // Remove any previous theme script
    if (window._themeScript) {
        document.head.removeChild(window._themeScript);
        window._themeScript = null;
        window.location.reload();
    }
    if (themeObj && themeObj.js) {
        // Load JS file as a script element
        const script = document.createElement('script');
        script.src = themeObj.js + '?v=' + Math.floor(Date.now() / cache_lim);
        script.onload = function() {};
        document.head.appendChild(script);
        window._themeScript = script;
    }
    // Remove theme param from URL so it doesn't override user choice on reload
    const url = new URL(window.location.href);
    if (url.searchParams.has('theme')) {
        url.searchParams.delete('theme');
        window.history.replaceState({}, '', url.toString());
    }
    // Update theme selector to reflect new theme
    const themeSelector = document.getElementById('themeSelector');
    if (themeSelector) {
        themeSelector.value = theme;
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
// function init() {
//     // Add language selector to controls
//     const controls = document.querySelector('.controls');
//     if (!document.getElementById('langSelector')) {
//         controls.appendChild(createLanguageSelector());
//     }
//     // Add theme selector to controls
//     if (!document.getElementById('themeSelector')) {
//         controls.appendChild(createThemeSelector());
//     }
//     // Add sort controls if not present
//     if (!document.getElementById('sortBySelect')) {
//         controls.appendChild(createSortControls());
//     }
//     // Set theme preference if not set
//     let theme = getThemeFromURLorStorage();
//     saveThemePreference(theme);
//     setTheme(theme);
//     renderTagCloud();
//     displayGames(gameDatabase);
//     renderPagination();
//     updateUIText();
//     renderNotices();
//     renderFavouritesSection();
//     renderRecentlyPlayedSection();
//     // Remove this line to prevent infinite recursion:
//     // setLanguage(currentLang); // Ensure language is set after UI is ready
//     updateTimerUIText();
// }

let tagSearchTerm = '';
let tagListExpanded = false;

let tagSuggestions = [];

function searchTags() {
    tagSearchTerm = document.getElementById('tagSearchInput').value.toLowerCase();
    
    if (tagSearchTerm.length > 0) {
        showTagSuggestions();
    } else {
        hideTagSuggestions();
    }
    
    renderTagCloud();
}

function showTagSuggestions() {
    const allTags = [...new Set(gameDatabase.flatMap(game => game.tags))];
    const t = translations[currentLang] || translations.en;
    
    // Find matching tags that aren't already selected
    const matchingTags = allTags.filter(tag => {
        const tagName = (t.tagNames && t.tagNames[tag]) || tag;
        return tagName.toLowerCase().includes(tagSearchTerm) && 
               !currentFilters.activeTags.includes(tag);
    }).slice(0, 8); // Limit to 8 suggestions
    
    if (matchingTags.length === 0) {
        hideTagSuggestions();
        return;
    }
    
    let suggestionsContainer = document.getElementById('tagSuggestions');
    if (!suggestionsContainer) {
        suggestionsContainer = document.createElement('div');
        suggestionsContainer.id = 'tagSuggestions';
        suggestionsContainer.className = 'tag-suggestions';
        document.getElementById('tagSearchInput').parentNode.appendChild(suggestionsContainer);
    }
    
    suggestionsContainer.innerHTML = matchingTags.map(tag => {
        const tagName = (t.tagNames && t.tagNames[tag]) || tag;
        return `<div class="tag-suggestion" onclick="addTagFromSuggestion('${tag}')">${tagName}</div>`;
    }).join('');
    
    suggestionsContainer.style.display = 'block';
}

function hideTagSuggestions() {
    const suggestionsContainer = document.getElementById('tagSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

function addTagFromSuggestion(tag) {
    currentFilters.activeTags.push(tag);
    currentPage = 1;
    
    // Clear search input and hide suggestions
    document.getElementById('tagSearchInput').value = '';
    tagSearchTerm = '';
    hideTagSuggestions();
    
    applyFilters();
    renderTagCloud();
}

function toggleTagListExpand() {
    tagListExpanded = !tagListExpanded;
    renderTagCloud();
    updateUIText(); // Update button text
}

function renderTagCloud() {
    const tagCloud = document.getElementById('tagCloud');
    const allTags = [...new Set(gameDatabase.flatMap(game => game.tags))];
    const t = translations[currentLang] || translations.en;

    // Filter tags based on search term
    const filteredTags = allTags.filter(tag => {
        const tagName = (t.tagNames && t.tagNames[tag]) || tag;
        return tagName.toLowerCase().includes(tagSearchTerm);
    });

    // Sort tags to show active ones first, then alphabetically
    const sortedTags = filteredTags.sort((a, b) => {
        const aActive = currentFilters.activeTags.includes(a);
        const bActive = currentFilters.activeTags.includes(b);
        if (aActive && !bActive) return -1;
        if (!aActive && bActive) return 1;
        
        // Within same active state, sort alphabetically
        const aName = (t.tagNames && t.tagNames[a]) || a;
        const bName = (t.tagNames && t.tagNames[b]) || b;
        return aName.localeCompare(bName);
    });

    // Always show active tags, then show others based on expand state
    const activeTags = sortedTags.filter(tag => currentFilters.activeTags.includes(tag));
    const inactiveTags = sortedTags.filter(tag => !currentFilters.activeTags.includes(tag));
    
    let tagsToShow = activeTags;
    if (tagListExpanded) {
        tagsToShow = [...activeTags, ...inactiveTags];
    } else {
        // Show first 10 inactive tags when collapsed
        tagsToShow = [...activeTags, ...inactiveTags.slice(0, 10)];
    }

    tagCloud.innerHTML = tagsToShow.map(tag => {
        const isActive = currentFilters.activeTags.includes(tag);
        const tagName = (t.tagNames && t.tagNames[tag]) || tag;
        return `<span class="tag ${isActive ? 'active' : ''}" onclick="toggleTagFilter('${tag}')">${tagName}</span>`;
    }).join('');

    // Apply collapsed state if not expanded
    if (!tagListExpanded) {
        tagCloud.classList.add('collapsed');
        tagCloud.classList.remove('expanded');
    } else {
        tagCloud.classList.add('expanded');
        tagCloud.classList.remove('collapsed');
    }
}

function toggleTagFilter(tag) {
    const index = currentFilters.activeTags.indexOf(tag);
    if (index === -1) {
        currentFilters.activeTags.push(tag);
    } else {
        currentFilters.activeTags.splice(index, 1);
    }
    currentPage = 1; // Reset page on filter change
    applyFilters();
}

function resetFilters() {
    currentFilters.searchTerm = '';
    currentFilters.activeTags = [];
    tagSearchTerm = '';
    currentPage = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('tagSearchInput').value = '';
    applyFilters();
}

function searchGames() {
    currentFilters.searchTerm = document.getElementById('searchInput').value.toLowerCase();
    currentPage = 1; // Reset page on filter change
    applyFilters();
}

function createSortControls() {
    const t = translations[currentLang];
    const container = document.createElement('div');
    container.className = 'sort-controls';

    // Sort by select
    const sortBySel = document.createElement('select');
    sortBySel.id = 'sortBySelect';
    [
        { value: 'name', label: t.sortByName || 'Name' },
        { value: 'updated', label: t.sortByUpdated || 'Last Updated' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        if (currentFilters.sortBy === opt.value) o.selected = true;
        sortBySel.appendChild(o);
    });
    sortBySel.onchange = () => {
        currentFilters.sortBy = sortBySel.value;
        applyFilters();
    };

    // Sort direction select
    const sortDirSel = document.createElement('select');
    sortDirSel.id = 'sortDirSelect';
    [
        { value: 'asc', label: t.ascending || 'Ascending' },
        { value: 'desc', label: t.descending || 'Descending' }
    ].forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        if (currentFilters.sortDir === opt.value) o.selected = true;
        sortDirSel.appendChild(o);
    });
    sortDirSel.onchange = () => {
        currentFilters.sortDir = sortDirSel.value;
        applyFilters();
    };

    container.appendChild(sortBySel);
    container.appendChild(sortDirSel);
    return container;
}

// --- Parallelize heavy operations using Web Workers if available ---

// Helper to run a function in a worker and get the result as a Promise
function runInWorker(fn, data) {
    return new Promise((resolve, reject) => {
        if (!window.Worker) {
            // Fallback: run in main thread
            try {
                resolve(fn(data));
            } catch (e) {
                reject(e);
            }
            return;
        }
        const blob = new Blob([
            `
            onmessage = function(e) {
                const fn = ${fn.toString()};
                try {
                    postMessage({result: fn(e.data)});
                } catch (err) {
                    postMessage({error: err && err.message});
                }
            }
            `
        ], { type: "application/javascript" });
        const worker = new Worker(URL.createObjectURL(blob));
        worker.onmessage = function(e) {
            if (e.data && e.data.error) reject(e.data.error);
            else resolve(e.data.result);
            worker.terminate();
        };
        worker.onerror = function(e) {
            reject(e.message);
            worker.terminate();
        };
        worker.postMessage(data);
    });
}

// Example: parallelize filtering and sorting of games
function applyFilters() {
    const tLang = currentLang;
    // Move filtering to a worker if possible
    runInWorker(function({gameDatabase, currentFilters, tLang, favIds}) {
        function getName(game) {
            return (game.name_i18n && game.name_i18n[tLang]) || game.name || "";
        }
        function getAuthor(game) {
            return (game.author_i18n && game.author_i18n[tLang]) || game.author || "";
        }
        let filtered = gameDatabase.filter(game => {
            const name = getName(game);
            const author = getAuthor(game);
            const matchesSearch =
                name.toLowerCase().includes(currentFilters.searchTerm) ||
                author.toLowerCase().includes(currentFilters.searchTerm);
            const matchesTags =
                currentFilters.activeTags.length === 0 ||
                currentFilters.activeTags.every(tag => game.tags.includes(tag));
            return matchesSearch && matchesTags;
        });
        // Sorting
        if (currentFilters.sortBy === 'updated') {
            filtered.sort((a, b) => {
                const aVal = a.updated || a.lastUpdated || 0;
                const bVal = b.updated || b.lastUpdated || 0;
                return currentFilters.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            });
        } else {
            filtered.sort((a, b) => {
                const aVal = getName(a).toLowerCase();
                const bVal = getName(b).toLowerCase();
                if (aVal < bVal) return currentFilters.sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return currentFilters.sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        // Move favourites to the front, preserving order and avoiding duplicates
        const favGames = favIds.map(id => filtered.find(g => g.id === id)).filter(Boolean);
        const nonFavGames = filtered.filter(g => !favIds.includes(g.id));
        return [...favGames, ...nonFavGames];
    }, {
        gameDatabase,
        currentFilters,
        tLang,
        favIds: getFavourites()
    }).then(results => {
        displayGames(results);
        renderPagination(results.length);
        renderTagCloud(); // Re-render tag cloud to update active states
    }).catch(() => {
        // fallback to main thread if worker fails
        const results = gameDatabase.filter(game => {
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
        // Sorting
        if (currentFilters.sortBy === 'updated') {
            results.sort((a, b) => {
                const aVal = a.updated || a.lastUpdated || 0;
                const bVal = b.updated || b.lastUpdated || 0;
                return currentFilters.sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            });
        } else {
            results.sort((a, b) => {
                const aVal = ((a.name_i18n && a.name_i18n[tLang]) || a.name || "").toLowerCase();
                const bVal = ((b.name_i18n && b.name_i18n[tLang]) || b.name || "").toLowerCase();
                if (aVal < bVal) return currentFilters.sortDir === 'asc' ? -1 : 1;
                if (aVal > bVal) return currentFilters.sortDir === 'asc' ? 1 : -1;
                return 0;
            });
        }
        // Move favourites to the front, preserving order and avoiding duplicates
        const favIds = getFavourites();
        const favGames = favIds.map(id => results.find(g => g.id === id)).filter(Boolean);
        const nonFavGames = results.filter(g => !favIds.includes(g.id));
        const orderedGames = [...favGames, ...nonFavGames];
        displayGames(orderedGames);
        renderPagination(orderedGames.length);
        renderTagCloud();
    });
}

function getGameImage(game, lang) {
    // Try current lang, then en, then first available
    if (game.images && game.images[lang]) return game.images[lang];
    if (game.images && game.images.en) return game.images.en;
    if (game.images) {
        const keys = Object.keys(game.images);
        if (keys.length) return game.images[keys[0]];
    }
    return null;
}

function getGameGif(game, lang) {
    if (game.gifs && game.gifs[lang]) return game.gifs[lang];
    if (game.gifs && game.gifs.en) return game.gifs.en;
    if (game.gifs) {
        const keys = Object.keys(game.gifs);
        if (keys.length) return game.gifs[keys[0]];
    }
    return null;
}

// --- Pagination fragment config ---
const PAGINATION_PRELOAD_PAGES = 2; // Number of pages after current to pre-render
let gamePageFragments = {}; // { pageNum: HTML string }

function displayGames(games) {
    const t = translations[currentLang];
    const tLang = currentLang;
    const favIds = getFavourites();
    // Move favourites to the front, preserving order and avoiding duplicates
    const favGames = favIds.map(id => games.find(g => g.id === id)).filter(Boolean);
    const nonFavGames = games.filter(g => !favIds.includes(g.id));
    const orderedGames = [...favGames, ...nonFavGames];

    const totalGames = orderedGames.length;
    const pageCount = Math.ceil(totalGames / gamesPerPage);

    // Prepare fragments for current and next N pages
    gamePageFragments = {};
    for (let i = 0; i < PAGINATION_PRELOAD_PAGES + 1; ++i) {
        const pageNum = currentPage + i;
        if (pageNum > pageCount) break;
        const startIdx = (pageNum - 1) * gamesPerPage;
        const paginatedGames = orderedGames.slice(startIdx, startIdx + gamesPerPage);
        gamePageFragments[pageNum] = paginatedGames.map((game, idx) => {
            // Translate tags for display using tag key
            const tagLabels = game.tags.map(tag => (t.tagNames && t.tagNames[tag]) || tag);
            // Use translated name/author if available
            const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
            const author = (game.author_i18n && game.author_i18n[tLang]) || game.author;
            // Image/gif logic
            const imgSrc = getGameImage(game, tLang);
            const gifSrc = getGameGif(game, tLang);
            // Determine if gif should be shown by default on mobile for this game
            const isMobile = isTouchDevice();
            const playGifOnMobile = (typeof game.playGifOnMobile === "boolean") ? game.playGifOnMobile : true;
            const showGif = isMobile && gifSrc && playGifOnMobile;
            let imgHtml = '';
            if (imgSrc || gifSrc) {
                imgHtml = `
                    <span class="game-thumb-wrapper">
                        ${imgSrc ? `<img class="game-thumb game-thumb-static" src="${imgSrc}" loading="lazy" alt="${name}" style="${showGif ? 'opacity:0;' : ''}">` : ''}
                        ${gifSrc ? `<img class="game-thumb game-thumb-gif" src="${gifSrc}" loading="lazy" alt="${name}" style="${showGif ? 'opacity:1;z-index:2;' : ''}">` : ''}
                    </span>
                `;
            }
            // Add favourite icon
            const favIcon = `<span class="fav-icon" title="${isFavourite(game.id) ? (t.removeFavourite || "Remove from favourites") : (t.addFavourite || "Add to favourites")}" onclick="event.stopPropagation();toggleFavourite(${game.id});return false;">${isFavourite(game.id) ? "★" : "☆"}</span>`;
            // Add data-game-id for popup
            return `
            <div class="game-card" onclick="loadGame(${game.id})"
                data-game-id="${game.id}">
                ${favIcon}
                ${imgHtml}
                <h3>${name}</h3>
                <p>${t.by} ${author} (${game.email})</p>
                <p>${t.tags}: ${tagLabels.join(', ')}</p>
            </div>
            `;
        }).join('');
    }

    // Only append the current page fragment to DOM after all fragments are prepared
    document.getElementById('gameList').innerHTML = gamePageFragments[currentPage] || '';

    // Optionally, you could pre-cache the next pages' fragments for smoother UX

    // Attach description popup handlers after rendering (fix: always call here)
    attachGameCardDescHandlers();
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

// --- Multiple Game Windows Management ---
let gameWindowZ = 3000;
let openGameWindows = {};

function loadGame(id) {
    const game = gameDatabase.find(g => g.id === id);
    if (!game) return;
    // If already open, bring to front
    if (openGameWindows[id]) {
        focusGameWindow(id);
        return;
    }
    const tLang = currentLang;
    const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
    // Determine which settings to pass
    const passSettings = Array.isArray(game.passSettings)
        ? game.passSettings
        : ["lang", "theme"];
    const params = [];
    if (passSettings.includes("lang")) {
        params.push("lang=" + encodeURIComponent(currentLang));
    }
    if (passSettings.includes("theme")) {
        const theme = getThemeFromURLorStorage();
        params.push("theme=" + encodeURIComponent(theme));
    }
    let url = game.url;
    if (params.length > 0) {
        url += (url.includes("?") ? "&" : "?") + params.join("&");
    }
    createGameWindow({
        id,
        title: name,
        url,
        game
    });
    addRecentlyPlayed(id);
}

function createGameWindow({id, title, url, game}) {
    const container = document.getElementById('gameWindowsContainer');
    if (!container) return;
    // Initial size/position
    const width = Math.min(600, window.innerWidth * 0.7);
    const height = Math.min(420, window.innerHeight * 0.7);
    const left = 40 + Object.keys(openGameWindows).length * 30;
    const top = 40 + Object.keys(openGameWindows).length * 30;

    // Window element
    const win = document.createElement('div');
    win.className = 'game-window';
    win.style.width = width + 'px';
    win.style.height = height + 'px';
    win.style.left = left + 'px';
    win.style.top = top + 'px';
    win.style.zIndex = ++gameWindowZ;
    win.dataset.gameId = id;

    // Header
    const header = document.createElement('div');
    header.className = 'game-window-header';
    // Attach both mouse and touch drag handlers
    header.onmousedown = e => dragGameWindow(e, win);
    header.ontouchstart = e => dragGameWindow(e, win);

    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = 'game-window-title';
    titleSpan.textContent = title;

    // Controls
    const controls = document.createElement('div');
    controls.className = 'game-window-controls';

    // Maximize/restore button
    const maxBtn = document.createElement('button');
    maxBtn.className = 'game-window-btn';
    maxBtn.title = 'Maximize';
    maxBtn.innerHTML = '⬜';
    maxBtn.onclick = e => {
        e.stopPropagation();
        toggleMaximizeGameWindow(win, id);
    };
    // Add touch support for maximize
    maxBtn.ontouchstart = e => {
        e.stopPropagation();
        toggleMaximizeGameWindow(win, id);
    };

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'game-window-btn';
    closeBtn.title = 'Close';
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = e => {
        e.stopPropagation();
        closeGameWindow(id);
    };
    // Add touch support for close
    closeBtn.ontouchstart = e => {
        e.stopPropagation();
        closeGameWindow(id);
    };

    controls.appendChild(maxBtn);
    controls.appendChild(closeBtn);

    header.appendChild(titleSpan);
    header.appendChild(controls);

    // Iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'game-window-iframe';
    iframe.src = url;
    iframe.allowFullscreen = true;

    // Recommendations (hidden unless maximized)
    const recDiv = document.createElement('div');
    recDiv.className = 'game-window-recommendations';
    recDiv.style.display = 'none';

    // Resizer
    const resizer = document.createElement('div');
    resizer.className = 'game-window-resizer';
    resizer.onmousedown = e => resizeGameWindow(e, win);

    // Assemble
    win.appendChild(header);
    win.appendChild(iframe);
    win.appendChild(recDiv);
    win.appendChild(resizer);

    // Focus on click (fix: only focus if not touch event)
    win.onmousedown = (e) => {
        // Only focus if not touch event (prevents tap-through on mobile)
        if (!e || e.pointerType === undefined || e.pointerType === "mouse") {
            focusGameWindow(id);
        }
    };
    // Prevent tap-through on touch devices
    win.ontouchstart = (e) => {
        // Prevent tap-through by stopping propagation
        e.stopPropagation();
        focusGameWindow(id);
    };

    // Add to DOM and registry
    container.appendChild(win);
    openGameWindows[id] = {win, iframe, recDiv, game, maximized: false, prev: {}};
    focusGameWindow(id);
}

function focusGameWindow(id) {
    if (!openGameWindows[id]) return;
    gameWindowZ++;
    openGameWindows[id].win.style.zIndex = gameWindowZ;
}

function closeGameWindow(id) {
    const entry = openGameWindows[id];
    if (entry) {
        // Prevent tap-through: add a short blocker overlay on mobile/touch
        if (isTouchDevice()) {
            showTapBlocker();
        }
        entry.win.remove();
        delete openGameWindows[id];
    }
}

function toggleMaximizeGameWindow(win, id) {
    const entry = openGameWindows[id];
    if (!entry) return;
    if (!entry.maximized) {
        // Save previous size/pos and z-index
        entry.prev = {
            width: win.style.width,
            height: win.style.height,
            left: win.style.left,
            top: win.style.top,
            zIndex: win.style.zIndex
        };
        win.classList.add('maximized');
        win.style.width = '100vw';
        win.style.height = '100vh';
        win.style.left = '0';
        win.style.top = '0';
        // Set z-index higher than any other window
        win.style.zIndex = ++gameWindowZ + 1000;
        entry.maximized = true;
        // Show recommendations
        entry.recDiv.style.display = '';
        renderGameWindowRecommendations(id);
    } else {
        // Restore
        win.classList.remove('maximized');
        win.style.width = entry.prev.width;
        win.style.height = entry.prev.height;
        win.style.left = entry.prev.left;
        win.style.top = entry.prev.top;
        win.style.zIndex = entry.prev.zIndex;
        entry.maximized = false;
        // Hide recommendations
        entry.recDiv.style.display = 'none';
        entry.recDiv.innerHTML = '';
        // Prevent tap-through: add a short blocker overlay on mobile/touch
        if (isTouchDevice()) {
            showTapBlocker();
        }
    }
}

function renderGameWindowRecommendations(gameId) {
    const entry = openGameWindows[gameId];
    if (!entry) return;
    const t = translations[currentLang];
    const tLang = currentLang;
    const recs = getRecommendedGames(gameId);
    entry.recDiv.innerHTML = `
        <h3>${t.recommended}</h3>
        ${recs.map(game => {
            const tagLabels = game.tags.map(tag => (t.tagNames && t.tagNames[tag]) || tag);
            const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
            return `
            <div class="rec-item" onclick="loadGame(${game.id})">
                ${name} (${tagLabels.join(', ')})
            </div>
            `;
        }).join('')}
    `;
}

// Drag logic (mouse and touch support)
function dragGameWindow(e, win) {
    if (win.classList.contains('maximized')) return;
    let isTouch = e.type === "touchstart";
    let moveListener, upListener;

    // Prevent default for touch and mouse
    if (isTouch) {
        if (e.touches.length !== 1) return;
        e.preventDefault();
        const touch = e.touches[0];
        focusGameWindow(win.dataset.gameId);
        let startX = touch.clientX, startY = touch.clientY;
        let rect = win.getBoundingClientRect();
        let offsetX = startX - rect.left, offsetY = startY - rect.top;
        moveListener = function(ev) {
            if (ev.touches.length !== 1) return;
            ev.preventDefault();
            const t = ev.touches[0];
            let x = t.clientX - offsetX;
            let y = t.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - win.offsetHeight, y));
            win.style.left = x + 'px';
            win.style.top = y + 'px';
        };
        upListener = function() {
            document.removeEventListener('touchmove', moveListener, {passive:false});
            document.removeEventListener('touchend', upListener);
        };
        document.addEventListener('touchmove', moveListener, {passive:false});
        document.addEventListener('touchend', upListener);
    } else {
        e.preventDefault();
        focusGameWindow(win.dataset.gameId);
        let startX = e.clientX, startY = e.clientY;
        let rect = win.getBoundingClientRect();
        let offsetX = startX - rect.left, offsetY = startY - rect.top;
        moveListener = function(ev) {
            let x = ev.clientX - offsetX;
            let y = ev.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - win.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - win.offsetHeight, y));
            win.style.left = x + 'px';
            win.style.top = y + 'px';
        };
        upListener = function() {
            document.removeEventListener('mousemove', moveListener);
            document.removeEventListener('mouseup', upListener);
        };
        document.addEventListener('mousemove', moveListener);
        document.addEventListener('mouseup', upListener);
    }
}

// Resize logic
function resizeGameWindow(e, win) {
    if (win.classList.contains('maximized')) return;
    e.preventDefault();
    focusGameWindow(win.dataset.gameId);
    let startX = e.clientX, startY = e.clientY;
    let startW = win.offsetWidth, startH = win.offsetHeight;
    function onMove(ev) {
        let newW = Math.max(320, startW + (ev.clientX - startX));
        let newH = Math.max(220, startH + (ev.clientY - startY));
        newW = Math.min(window.innerWidth - win.offsetLeft, newW);
        newH = Math.min(window.innerHeight - win.offsetTop, newH);
        win.style.width = newW + 'px';
        win.style.height = newH + 'px';
    }
    function onUp() {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
}

// --- Favourites and Recently Played Management ---
const FAV_KEY = "favouriteGames";
const RECENT_KEY = "recentlyPlayedGames";
const MAX_RECENT = 10;

function getFavourites() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
    } catch { return []; }
}
function setFavourites(favs) {
    localStorage.setItem(FAV_KEY, JSON.stringify(favs));
}
function toggleFavourite(gameId) {
    let favs = getFavourites();
    if (favs.includes(gameId)) {
        favs = favs.filter(id => id !== gameId);
    } else {
        favs.push(gameId);
    }
    setFavourites(favs);
    renderFavouritesSection();
    applyFilters(); // To update favourite icons
}
function isFavourite(gameId) {
    return getFavourites().includes(gameId);
}

function getRecentlyPlayed() {
    try {
        return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch { return []; }
}
function addRecentlyPlayed(gameId) {
    let recent = getRecentlyPlayed();
    recent = recent.filter(id => id !== gameId);
    recent.unshift(gameId);
    if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    renderRecentlyPlayedSection();
}
function clearRecentlyPlayed() {
    localStorage.removeItem(RECENT_KEY);
    renderRecentlyPlayedSection();
}

function renderFavouritesSection() {
    const t = translations[currentLang];
    const favIds = getFavourites();
    if (!favIds.length) {
        document.getElementById('favouritesSection').innerHTML = '';
        return;
    }
    const favGames = favIds.map(id => gameDatabase.find(g => g.id === id)).filter(Boolean);
    document.getElementById('favouritesSection').innerHTML = `
        <div class="favourites-header">
            <h3>${t.favourites || "Favourites"}</h3>
            <button onclick="clearFavourites()">${t.clear || "Clear"}</button>
        </div>
        <div class="favourites-list">
            ${favGames.map(game => {
                const name = (game.name_i18n && game.name_i18n[currentLang]) || game.name;
                return `<span class="favourite-game" onclick="loadGame(${game.id})">
                    ${name}
                    <button class="fav-remove-btn" title="${t.removeFavourite || "Remove from favourites"}" onclick="event.stopPropagation();removeFavourite(${game.id});return false;">✕</button>
                </span>`;
            }).join('')}
        </div>
    `;
}

function clearFavourites() {
    localStorage.removeItem(FAV_KEY);
    renderFavouritesSection();
    applyFilters();
}
function removeFavourite(gameId) {
    let favs = getFavourites();
    favs = favs.filter(id => id !== gameId);
    setFavourites(favs);
    renderFavouritesSection();
    applyFilters();
}

function renderRecentlyPlayedSection() {
    const t = translations[currentLang];
    const recentIds = getRecentlyPlayed();
    if (!recentIds.length) {
        document.getElementById('recentlyPlayedSection').innerHTML = '';
        return;
    }
    const recentGames = recentIds.map(id => gameDatabase.find(g => g.id === id)).filter(Boolean);
    document.getElementById('recentlyPlayedSection').innerHTML = `
        <div class="recent-header">
            <h3>${t.recentlyPlayed || "Recently Played"}</h3>
            <button onclick="clearRecentlyPlayed()">${t.clear || "Clear"}</button>
        </div>
        <div class="recent-list">
            ${recentGames.map(game => {
                const name = (game.name_i18n && game.name_i18n[currentLang]) || game.name;
                return `<span class="recent-game" onclick="loadGame(${game.id})">
                    ${name}
                    <button class="recent-remove-btn" title="${t.clear || "Remove"}" onclick="event.stopPropagation();removeRecentlyPlayed(${game.id});return false;">✕</button>
                </span>`;
            }).join('')}
        </div>
    `;
}

function removeRecentlyPlayed(gameId) {
    let recent = getRecentlyPlayed();
    recent = recent.filter(id => id !== gameId);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    renderRecentlyPlayedSection();
}

// --- Export/Import User Data ---
function exportUserData() {
    const data = {
        favourites: getFavourites(),
        recentlyPlayed: getRecentlyPlayed(),
        autoSaveWindows: getAutoSaveWindowsSetting(),
        openWindows: Object.keys(openGameWindows).map(id => {
            const entry = openGameWindows[id];
            if (!entry || !entry.win) return null;
            return {
                id: Number(id),
                left: entry.win.style.left,
                top: entry.win.style.top,
                width: entry.win.style.width,
                height: entry.win.style.height,
                maximized: !!entry.maximized
            };
        }).filter(Boolean),
        currentTheme: getThemeFromURLorStorage(),
        currentLang: currentLang,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "game_platform_userdata.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
function importUserData(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (Array.isArray(data.favourites)) setFavourites(data.favourites);
            if (Array.isArray(data.recentlyPlayed)) localStorage.setItem(RECENT_KEY, JSON.stringify(data.recentlyPlayed));
            //for saved windows
            var autoSaveCheckbox = document.getElementById('autoSaveWindowsCheckbox');
            autoSaveCheckbox.checked = data.autoSaveWindows;
            if (data.autoSaveWindows && Array.isArray(data.openWindows)) {
                data.openWindows.forEach(winData => {
                    if (winData && winData.id && !openGameWindows[winData.id]) {
                        createGameWindow({
                            id: winData.id,
                            title: gameDatabase.find(g => g.id === winData.id)?.name || "Game " + winData.id,
                            url: gameDatabase.find(g => g.id === winData.id)?.url || "#",
                            game: gameDatabase.find(g => g.id === winData.id) || {}
                        });
                        const entry = openGameWindows[winData.id];
                        if (entry && entry.win) {
                            entry.win.style.left = winData.left || '40px';
                            entry.win.style.top = winData.top || '40px';
                            entry.win.style.width = winData.width || '600px';
                            entry.win.style.height = winData.height || '420px';
                            if (winData.maximized) {
                                toggleMaximizeGameWindow(entry.win, winData.id);
                            }
                        }
                    }
                });
                //shift autosave checkbox
                setAutoSaveWindowsSetting(1);
            }
            else {
                setAutoSaveWindowsSetting(0);
            }
            //for theme and lang
            if(data.currentLang) setLanguage(data.currentLang);
            if(data.currentTheme) setTheme(data.currentTheme);
            renderFavouritesSection();
            renderRecentlyPlayedSection();
            applyFilters();
            alert("Data imported successfully.");
        } catch {
            alert("Invalid data file.");
        }
    };
    reader.readAsText(file);
    // Reset input so user can import again if needed
    event.target.value = "";
}

// --- TIMER FEATURE ---

let timerState = {
    duration: 0, // ms
    remaining: 0, // ms
    running: false,
    interval: null,
    endTime: null
};

function updateTimerUIText() {
    const t = translations[currentLang];
    document.getElementById('timerStartBtn').textContent = t.timerStart || "Start Timer";
    document.getElementById('timerStopBtn').textContent = t.timerStop || "Stop Timer";
    document.getElementById('timerMinutes').title = t.timerSetMinutes || "Set minutes";
}

function formatTimerTime(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

function startGameTimer() {
    const minutes = parseFloat(document.getElementById('timerMinutes').value);
    if (isNaN(minutes) || minutes < 0.1) return;
    timerState.duration = minutes * 60 * 1000;
    timerState.remaining = timerState.duration;
    timerState.running = true;
    timerState.endTime = Date.now() + timerState.duration;

    document.getElementById('timerStartBtn').disabled = true;
    document.getElementById('timerStopBtn').disabled = false;
    document.getElementById('timerMinutes').disabled = true;

    showTimerProgressBar();
    updateTimerProgressBar();

    timerState.interval = setInterval(() => {
        timerState.remaining = timerState.endTime - Date.now();
        updateTimerProgressBar();
        if (timerState.remaining <= 0) {
            stopGameTimer(true);
            showTimerEndOverlay();
        }
    }, 500);
}

function stopGameTimer(isEnd = false) {
    timerState.running = false;
    timerState.endTime = null;
    if (timerState.interval) clearInterval(timerState.interval);
    timerState.interval = null;
    hideTimerProgressBar();
    document.getElementById('timerStartBtn').disabled = false;
    document.getElementById('timerStopBtn').disabled = true;
    document.getElementById('timerMinutes').disabled = false;
    //if (!isEnd) hideTimerEndOverlay();
}

function showTimerProgressBar() {
    document.getElementById('timerProgressBar').classList.remove('hidden');
}

function hideTimerProgressBar() {
    document.getElementById('timerProgressBar').classList.add('hidden');
}

function updateTimerProgressBar() {
    const fill = document.getElementById('timerProgressFill');
    const text = document.getElementById('timerProgressText');
    const percent = Math.max(0, Math.min(100, 100 * (timerState.remaining / timerState.duration)));
    fill.style.width = percent + "%";
    const t = translations[currentLang];
    text.textContent = (t.timerRemaining || "Time left") + ": " + formatTimerTime(timerState.remaining);
}

function showTimerEndOverlay() {
    const overlay = document.getElementById('timerEndOverlay');
    overlay.classList.remove('hidden');
    const t = translations[currentLang];
    document.getElementById('timerEndTitle').textContent = t.timerEndedTitle || "Time's Up!";
    document.getElementById('timerEndMsg').textContent = t.timerEndedMsg || "Your game time is over. Please take a break.";
    document.getElementById('timerReturnBtn').textContent = t.timerReturn || "Return";
    // Optionally, close all game windows
    Object.keys(openGameWindows).forEach(closeGameWindow);
}

function hideTimerEndOverlay() {
    document.getElementById('timerEndOverlay').classList.add('hidden');
    stopGameTimer();
}

// --- Patch updateUIText to update timer controls ---
// function updateUIText() {
//     const t = translations[currentLang];
//     document.getElementById('title').textContent = t.title;
//     document.getElementById('title_banner').textContent = t.title_banner;
//     document.getElementById('searchInput').placeholder = t.searchPlaceholder;
//     document.getElementById('searchBtn').textContent = t.search;
//     document.getElementById('resetBtn').textContent = t.reset;
//     document.getElementById('importBtn').textContent = t.importData;
//     document.getElementById('exportBtn').textContent = t.exportData;
//     // Timer controls
//     updateTimerUIText();
//     // Update theme selector to reflect new language
//     updateThemeSelector();
//     // Update pagination and recommendations via rerender

//     // Update sort controls
//     const sortBySel = document.getElementById('sortBySelect');
//     const sortDirSel = document.getElementById('sortDirSelect');
//     if (sortBySel && sortDirSel) {
//         sortBySel.options[0].textContent = t.sortByName || 'Name';
//         sortBySel.options[1].textContent = t.sortByUpdated || 'Last Updated';
//         sortDirSel.options[0].textContent = t.ascending || 'Ascending';
//         sortDirSel.options[1].textContent = t.descending || 'Descending';
//     }
// }

// // --- Patch init to update timer controls on load ---
// function init() {
//     // Add language selector to controls
//     const controls = document.querySelector('.controls');
//     if (!document.getElementById('langSelector')) {
//         controls.appendChild(createLanguageSelector());
//     }
//     // Add theme selector to controls
//     if (!document.getElementById('themeSelector')) {
//         controls.appendChild(createThemeSelector());
//     }
//     // Add sort controls if not present
//     if (!document.getElementById('sortBySelect')) {
//         controls.appendChild(createSortControls());
//     }
//     // Set theme preference if not set
//     let theme = getThemeFromURLorStorage();
//     saveThemePreference(theme);
//     setTheme(theme);
//     renderTagCloud();
//     displayGames(gameDatabase);
//     renderPagination();
//     updateUIText();
//     renderNotices();
//     renderFavouritesSection();
//     renderRecentlyPlayedSection();
//     setLanguage(currentLang); // Ensure language is set after UI is ready
//     updateTimerUIText();
// }

// --- Expose timer functions for HTML ---
window.startGameTimer = startGameTimer;
window.stopGameTimer = stopGameTimer;
window.hideTimerEndOverlay = hideTimerEndOverlay;

// Expose for HTML
window.setLanguage = setLanguage;
window.setTheme = setTheme;
window.toggleFavourite = toggleFavourite;
window.clearFavourites = clearFavourites;
window.clearRecentlyPlayed = clearRecentlyPlayed;
window.exportUserData = exportUserData;
window.importUserData = importUserData;
window.removeFavourite = removeFavourite;
window.removeRecentlyPlayed = removeRecentlyPlayed;
window.addTagFromSuggestion = addTagFromSuggestion;
window.toggleTagListExpand = toggleTagListExpand;

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

function renderNotices() {
    const lang = currentLang;
    const config = window.noticesConfig;
    if (!config || !config.notices || !config.header) return;
    const header = config.header[lang] || config.header.en || "Notice";
    const notices = config.notices
        .filter(n => typeof n.shouldShow !== "function" || n.shouldShow())
        .map(n => {
            const type = n.type || "default";
            return `<div class="notice-box ${type}">
                <div class="notice-header">${header}</div>
                <div class="notice-content">${n.content[lang] || n.content.en || ""}</div>
            </div>`;
        })
        .join('');
    document.getElementById('noticePane').innerHTML = notices;
}

// --- Description Popup Logic ---
let descPopupTimer = null;
let descPopupElem = null;

function attachGameCardDescHandlers() {
    // Remove previous listeners/popups
    document.querySelectorAll('.game-card').forEach(card => {
        card.onmousedown = null;
        card.ontouchstart = null;
        card.onmouseup = null;
        card.onmouseleave = null;
        card.ontouchend = null;
        card.ontouchcancel = null;
        card.oncontextmenu = null;
    });
    document.querySelectorAll('.game-card').forEach(card => {
        const gameId = parseInt(card.getAttribute('data-game-id'), 10);
        if (!gameId) return;
        // Mouse
        card.onmousedown = e => {
            if (e.button !== 2) return; // Only left click
            descPopupTimer = setTimeout(() => showGameDescPopup(gameId, card), 500);
        };
        card.onmouseup = card.onmouseleave = () => {
            clearTimeout(descPopupTimer);
        };
        // Touch
        card.ontouchstart = e => {
            descPopupTimer = setTimeout(() => showGameDescPopup(gameId, card), 500);
        };
        card.ontouchend = card.ontouchcancel = () => {
            clearTimeout(descPopupTimer);
        };
        // Prevent context menu on long press
        card.oncontextmenu = e => {
            e.preventDefault();
            return false;
        };
    });
}

function showGameDescPopup(gameId, cardElem) {
    clearTimeout(descPopupTimer);
    if (descPopupElem) descPopupElem.remove();
    const game = gameDatabase.find(g => g.id === gameId);
    if (!game) return;
    const t = translations[currentLang];
    const desc = (game.description_i18n && game.description_i18n[currentLang]) || game.description || "";
    const name = (game.name_i18n && game.name_i18n[currentLang]) || game.name;
    // Create popup
    const popup = document.createElement('div');
    popup.className = 'game-desc-popup';
    popup.innerHTML = `
        <button class="desc-close-btn" onclick="hideGameDescPopup()" title="Close">✕</button>
        <div class="desc-title">${t.description || "Description"}</div>
        <div class="desc-name"><b>${name}</b></div>
        <div class="desc-body" style="margin-top:8px;">${desc}</div>
    `;
    // Centered in viewport
    document.body.appendChild(popup);
    descPopupElem = popup;
    // Dismiss on click outside or ESC
    setTimeout(() => {
        document.addEventListener('mousedown', descPopupOutsideHandler, {capture:true});
        document.addEventListener('touchstart', descPopupOutsideHandler, {capture:true});
        document.addEventListener('keydown', descPopupEscHandler);
    }, 10);
}
function hideGameDescPopup() {
    if (descPopupElem) {
        descPopupElem.remove();
        descPopupElem = null;
    }
    document.removeEventListener('mousedown', descPopupOutsideHandler, {capture:true});
    document.removeEventListener('touchstart', descPopupOutsideHandler, {capture:true});
    document.removeEventListener('keydown', descPopupEscHandler);
}
function descPopupOutsideHandler(e) {
    if (descPopupElem && !descPopupElem.contains(e.target)) {
        hideGameDescPopup();
    }
}
function descPopupEscHandler(e) {
    if (e.key === "Escape") hideGameDescPopup();
}

// Expose for HTML close button
window.hideGameDescPopup = hideGameDescPopup;

// --- Tap Blocker Overlay for Mobile ---
function showTapBlocker() {
    let blocker = document.getElementById('tapBlockerOverlay');
    if (!blocker) {
        blocker = document.createElement('div');
        blocker.id = 'tapBlockerOverlay';
        blocker.style.position = 'fixed';
        blocker.style.left = '0';
        blocker.style.top = '0';
        blocker.style.width = '100vw';
        blocker.style.height = '100vh';
        blocker.style.zIndex = '999999';
        blocker.style.background = 'transparent';
        blocker.style.pointerEvents = 'auto';
        document.body.appendChild(blocker);
    }
    blocker.style.display = 'block';
    setTimeout(() => {
        blocker.style.display = 'none';
    }, 350); // 350ms is enough to absorb the tap
}

// --- Auto-Save Open Game Windows ---
const SAVED_WINDOWS_KEY = "openGameWindowsState";
const AUTO_SAVE_WINDOWS_KEY = "autoSaveGameWindows";

function saveOpenGameWindows() {
    const openIds = Object.keys(openGameWindows).map(id => {
        const entry = openGameWindows[id];
        if (!entry || !entry.win) return null;
        return {
            id: Number(id),
            left: entry.win.style.left,
            top: entry.win.style.top,
            width: entry.win.style.width,
            height: entry.win.style.height,
            maximized: !!entry.maximized
        };
    }).filter(Boolean);
    localStorage.setItem(SAVED_WINDOWS_KEY, JSON.stringify(openIds));
}

function restoreOpenGameWindows() {
    let saved = [];
    try {
        saved = JSON.parse(localStorage.getItem(SAVED_WINDOWS_KEY)) || [];
    } catch {}
    if (!Array.isArray(saved) || !saved.length) {
        return;
    }
    // Close all current windows first
    Object.keys(openGameWindows).forEach(closeGameWindow);
    // Open each saved window
    saved.forEach(winState => {
        const game = gameDatabase.find(g => g.id === winState.id);
        if (!game) return;
        const tLang = currentLang;
        const name = (game.name_i18n && game.name_i18n[tLang]) || game.name;
        const passSettings = Array.isArray(game.passSettings)
            ? game.passSettings
            : ["lang", "theme"];
        const params = [];
        if (passSettings.includes("lang")) {
            params.push("lang=" + encodeURIComponent(currentLang));
        }
        if (passSettings.includes("theme")) {
            const theme = getThemeFromURLorStorage();
            params.push("theme=" + encodeURIComponent(theme));
        }
        let url = game.url;
        if (params.length > 0) {
            url += (url.includes("?") ? "&" : "?") + params.join("&");
        }
        createGameWindow({
            id: winState.id,
            title: name,
            url,
            game
        });
        const entry = openGameWindows[winState.id];
        if (entry && entry.win) {
            if (!winState.maximized) {
                entry.win.style.left = winState.left;
                entry.win.style.top = winState.top;
                entry.win.style.width = winState.width;
                entry.win.style.height = winState.height;
                entry.maximized = false;
                entry.win.classList.remove('maximized');
            } else {
                if (!entry.maximized) toggleMaximizeGameWindow(entry.win, winState.id);
            }
        }
    });
}

function getAutoSaveWindowsSetting() {
    const val = localStorage.getItem(AUTO_SAVE_WINDOWS_KEY);
    if (val === null) return true;
    return val === "true";
}

function setAutoSaveWindowsSetting(val) {
    localStorage.setItem(AUTO_SAVE_WINDOWS_KEY, val ? "true" : "false");
}

// --- Patch updateUIText to update auto-save label ---
function updateUIText() {
    const t = translations[currentLang];
    document.getElementById('title').textContent = t.title;
    document.getElementById('title_banner').textContent = t.title_banner;
    document.getElementById('searchInput').placeholder = t.searchPlaceholder || 'Search games...';
    document.getElementById('searchBtn').textContent = t.search || 'Search';
    document.getElementById('resetBtn').textContent = t.reset || 'Reset';
    document.getElementById('importBtn').textContent = t.importData;
    document.getElementById('exportBtn').textContent = t.exportData;
    // Timer controls
    updateTimerUIText();
    // Update theme selector to reflect new language
    updateThemeSelector();
    // Update pagination and recommendations via rerender

    // Add/update auto-save label
    const autoSaveLabel = document.getElementById('autoSaveWindowsLabel');
    if (autoSaveLabel) {
        autoSaveLabel.childNodes[1].nodeValue = (t.saveWindows || "Save Windows");
    }

    document.getElementById('tagSearchInput').placeholder = t.searchTags || 'Search tags...';

    const expandBtn = document.getElementById('tagExpandBtn');
    if (tagListExpanded) {
        expandBtn.textContent = t.showFewerTags || 'Show Fewer Tags';
    } else {
        expandBtn.textContent = t.showAllTags || 'Show All Tags';
    }

    // Update sort controls
    const sortBySel = document.getElementById('sortBySelect');
    const sortDirSel = document.getElementById('sortDirSelect');
    if (sortBySel && sortDirSel) {
        sortBySel.options[0].textContent = t.sortByName || 'Name';
        sortBySel.options[1].textContent = t.sortByUpdated || 'Last Updated';
        sortDirSel.options[0].textContent = t.ascending || 'Ascending';
        sortDirSel.options[1].textContent = t.descending || 'Descending';
    }
}


// --- Patch init to add auto-save checkbox and restore windows on load ---
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

    // Add tag search and expand elements
    if (!document.getElementById('tagSearchInput')) {
        const tagSearchInput = document.createElement('input');
        tagSearchInput.type = 'text';
        tagSearchInput.id = 'tagSearchInput';
        tagSearchInput.placeholder = translations[currentLang].searchTags || 'Search tags...';
        controls.appendChild(tagSearchInput);

        const tagExpandBtn = document.createElement('button');
        tagExpandBtn.id = 'tagExpandBtn';
        tagExpandBtn.textContent = translations[currentLang].showAllTags || 'Show All Tags';
        tagExpandBtn.onclick = toggleTagListExpand;
        controls.appendChild(tagExpandBtn);
    }

    // Add sort controls if not present
    if (!document.getElementById('sortBySelect')) {
        controls.appendChild(createSortControls());
    }
    // Remove save/restore buttons if present (if any)
    const saveBtn = document.getElementById('saveWindowsBtn');
    if (saveBtn) saveBtn.remove();
    const restoreBtn = document.getElementById('restoreWindowsBtn');
    if (restoreBtn) restoreBtn.remove();
    // Add auto-save checkbox if not present
    if (!document.getElementById('autoSaveWindowsCheckbox')) {
        const label = document.createElement('label');
        label.id = 'autoSaveWindowsLabel';
        label.className = 'window-state-label';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'autoSaveWindowsCheckbox';
        checkbox.checked = getAutoSaveWindowsSetting();
        checkbox.onchange = function() {
            setAutoSaveWindowsSetting(checkbox.checked);
            if (checkbox.checked) saveOpenGameWindows();
        };
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + (translations[currentLang].saveWindows || "Save Windows")));
        controls.appendChild(label);
    }
    // Set theme preference if not set
    let theme = getThemeFromURLorStorage();
    saveThemePreference(theme);
    setTheme(theme);
    renderTagCloud();
    displayGames(gameDatabase);
    renderPagination();
    updateUIText();
    renderNotices();
    renderFavouritesSection();
    renderRecentlyPlayedSection();
    // Remove this line to prevent infinite recursion:
    // setLanguage(currentLang); // Ensure language is set after UI is ready
    updateTimerUIText();

    // Restore windows on load if enabled
    if (getAutoSaveWindowsSetting()) {
        setTimeout(restoreOpenGameWindows, 0);
    }

    document.getElementById('searchInput').addEventListener('input', debounce(function() {
        currentFilters.searchTerm = this.value.toLowerCase();
        currentPage = 1;
        applyFilters();
    }, 300));

    document.getElementById('tagSearchInput').addEventListener('input', debounce(function() {
        searchTags();
    }, 300));

    // Hide tag suggestions when clicking outside
    document.addEventListener('click', function(e) {
        const tagSearchInput = document.getElementById('tagSearchInput');
        const suggestionsContainer = document.getElementById('tagSuggestions');
        
        if (tagSearchInput && suggestionsContainer && 
            !tagSearchInput.contains(e.target) && 
            !suggestionsContainer.contains(e.target)) {
            hideTagSuggestions();
        }
    });
}

// --- Auto-save on window changes ---
function autoSaveIfEnabled() {
    if (getAutoSaveWindowsSetting()) saveOpenGameWindows();
}

// Patch create/close/maximize/restore to auto-save
const _orig_createGameWindow = createGameWindow;
createGameWindow = function(args) {
    _orig_createGameWindow(args);
    autoSaveIfEnabled();
};
const _orig_closeGameWindow = closeGameWindow;
closeGameWindow = function(id) {
    _orig_closeGameWindow(id);
    autoSaveIfEnabled();
};
const _orig_toggleMaximizeGameWindow = toggleMaximizeGameWindow;
toggleMaximizeGameWindow = function(win, id) {
    _orig_toggleMaximizeGameWindow(win, id);
    autoSaveIfEnabled();
};