const gamesPerPage = 6;
let currentPage = 1;
let currentFilters = {
    searchTerm: '',
    activeTags: []
};

function init() {
    renderTagCloud();
    displayGames(gameDatabase);
    renderPagination();
}

function renderTagCloud() {
    const allTags = [...new Set(gameDatabase.flatMap(g => g.tags))];
    const container = document.getElementById('tagCloud');
    container.innerHTML = allTags.map(tag => 
        `<span class="tag" onclick="toggleTagFilter('${tag}')">${tag}</span>`
    ).join('');
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
    const results = gameDatabase.filter(game => {
        const matchesSearch = game.name.toLowerCase().includes(currentFilters.searchTerm) || 
                            game.author.toLowerCase().includes(currentFilters.searchTerm);
        const matchesTags = currentFilters.activeTags.length === 0 || 
                          currentFilters.activeTags.every(tag => game.tags.includes(tag));
        return matchesSearch && matchesTags;
    });
    displayGames(results);
    renderPagination(results.length);
}

function displayGames(games) {
    const startIdx = (currentPage - 1) * gamesPerPage;
    const paginatedGames = games.slice(startIdx, startIdx + gamesPerPage);
    
    document.getElementById('gameList').innerHTML = paginatedGames.map(game => `
        <div class="game-card" onclick="loadGame(${game.id})">
            <h3>${game.name}</h3>
            <p>By ${game.author} (${game.email})</p>
            <p>Tags: ${game.tags.join(', ')}</p>
        </div>
    `).join('');
}

function renderPagination(totalGames = gameDatabase.length) {
    const pageCount = Math.ceil(totalGames / gamesPerPage);
    let paginationHTML = '';
    
    for (let i = 1; i <= pageCount; i++) {
        paginationHTML += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    
    document.getElementById('pagination').innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    applyFilters();
}

function loadGame(id) {
    const game = gameDatabase.find(g => g.id === id);
    document.getElementById('gameFrame').src = game.url;
    document.getElementById('fullscreenOverlay').style.display = 'flex';
    showRecommendations(id);
}

function showRecommendations(gameId) {
    const recs = getRecommendedGames(gameId);
    document.getElementById('recommendations').innerHTML = `
        <h3>Recommended Games</h3>
        ${recs.map(game => `
            <div class="rec-item" onclick="loadGame(${game.id})">
                ${game.name} (${game.tags.join(', ')})
            </div>
        `).join('')}
    `;
}

function closeFrame() {
    document.getElementById('fullscreenOverlay').style.display = 'none';
    document.getElementById('gameFrame').src = '';
}

window.onload = init;
