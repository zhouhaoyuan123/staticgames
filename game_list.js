// Hardcoded game data with tags
const gameDatabase = [
    {
        id: 1,
        name: "Rocket Game",
        name_i18n: {
            en: "Rocket Game",
            es: "Juego de Cohetes",
            fr: "Jeu de Fusée",
            de: "Raketen-Spiel",
            zh: "火箭游戏"
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "games/rocket.html",
        email: "a@example.com",
        tags: ["singleplayer","Aaron"],
        popularity: 0,
        passSettings: ["theme"],
        images: {
            en: "images/rocket_en.png",
            es: "images/rocket_es.png",
            fr: "images/rocket_fr.png",
            de: "images/rocket_de.png",
            zh: "images/rocket_zh.png"
        },
        gifs: {
            en: "images/rocket_en.gif",
            es: "images/rocket_es.gif",
            fr: "images/rocket_fr.gif",
            de: "images/rocket_de.gif",
            zh: "images/rocket_zh.gif"
        },
        playGifOnMobile: true
    },
    {
        id: 2,
        name: "Fish Game",
        name_i18n: {
            en: "Fish Game",
            es: "Juego de Peces",
            fr: "Jeu de Poisson",
            de: "Fisch-Spiel",
            zh: "捕鱼游戏"
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "games/fish_game.html",
        email: "a@example.com",
        tags: ["singleplayer","Aaron"],
        popularity: 0
        // playGifOnMobile not set, will use default (true)
    },
    {
        id: 3,
        name: "Maze Game",
        name_i18n: {
            en: "Maze Game",
            es: "Juego de Laberinto",
            fr: "Jeu de Labyrinthe",
            de: "Labyrinth-Spiel",
            zh: "迷宫游戏"
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "games/maze.html",
        email: "a@example.com",
        tags: ["singleplayer","Aaron"],
        popularity: 0,
        playGifOnMobile: false
    },
    {
        id: 4,
        name: "Usage",
        name_i18n: {
            en: "Usage",
            es: "Uso",
            fr: "Utilisation",
            de: "Verwendung",
            zh: "用法"
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "themes/README.md",
        email: "a@example.com",
        tags: ["docs"],
        popularity: 10
    },
    {
        id: 5,
        name: "Mouse Trap Game",
        name_i18n: {
            en: "Mouse Trap Game",
            es: "Juego de Trampa para Ratones",
            fr: "Jeu de Souris",
            de: "Mausefalle-Spiel",
            zh: "捕鼠游戏"
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "games/mouse.html",
        email: "a@example.com",
        tags: ["singleplayer","Aaron","mobile-friendly"],
        popularity: 0
    },
    // Add more games...
];

// If playGifOnMobile is not set, default is true
