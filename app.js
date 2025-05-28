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
    
    // Previous button
    paginationHTML += `
        <button class="page-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}>
            Previous
        </button>
    `;
    
    // Page input and total pages
    paginationHTML += `
        <div class="page-info">
            Page 
            <input type="number" 
                   id="pageInput" 
                   value="${currentPage}" 
                   min="1" 
                   max="${pageCount}"
                   onchange="jumpToPage(this.value)"
                   onkeypress="handlePageInputKeypress(event)">
            of ${pageCount}
        </div>
    `;
    
    // Next button
    paginationHTML += `
        <button class="page-btn ${currentPage === pageCount ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === pageCount ? 'disabled' : ''}>
            Next
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
