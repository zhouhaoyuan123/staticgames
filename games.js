
// Hardcoded game data with tags
const gameDatabase = [
    {
        id: 1,
        name: "Space Adventure",
        author: "Aaron",
        url: "games/rocket.html",
        email: "a@example.com",
        tags: ["singleplayer"],
        popularity: 0
    },
    // Add more games...
];

// Recommendation algorithm
function getRecommendedGames(currentGameId) {
    const currentGame = gameDatabase.find(game => game.id === currentGameId);
    return gameDatabase
        .filter(game => game.id !== currentGameId)
        .sort((a, b) => {
            const aScore = a.tags.filter(tag => currentGame.tags.includes(tag)).length;
            const bScore = b.tags.filter(tag => currentGame.tags.includes(tag)).length;
            return bScore - aScore || b.popularity - a.popularity;
        })
        .slice(0, 3);
}
