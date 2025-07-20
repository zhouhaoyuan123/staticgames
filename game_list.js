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
        // images: {
        //     en: "images/rocket_en.png",
        //     es: "images/rocket_es.png",
        //     fr: "images/rocket_fr.png",
        //     de: "images/rocket_de.png",
        //     zh: "images/rocket_zh.png"
        // },
        // gifs: {
        //     en: "images/rocket_en.gif",
        //     es: "images/rocket_es.gif",
        //     fr: "images/rocket_fr.gif",
        //     de: "images/rocket_de.gif",
        //     zh: "images/rocket_zh.gif"
        // },
        playGifOnMobile: true,
        description: "A fast-paced rocket flying game. Avoid obstacles and reach the goal!",
        description_i18n: {
            en: "A fast-paced rocket flying game. Avoid obstacles and reach the goal!",
            es: "Un juego de cohetes rápido. ¡Evita obstáculos y llega a la meta!",
            fr: "Un jeu de fusée rapide. Évitez les obstacles et atteignez l'objectif !",
            de: "Ein rasantes Raketenspiel. Weiche Hindernissen aus und erreiche das Ziel!",
            zh: "快节奏的火箭飞行游戏。避开障碍物，冲向终点！"
        },
        updated: 20240608
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
        popularity: 0,
        // playGifOnMobile not set, will use default (true)
        description: "Catch as many fish as you can before time runs out.",
        description_i18n: {
            en: "Catch as many fish as you can before time runs out.",
            es: "Atrapa tantos peces como puedas antes de que se acabe el tiempo.",
            fr: "Attrapez autant de poissons que possible avant la fin du temps.",
            de: "Fange so viele Fische wie möglich, bevor die Zeit abläuft.",
            zh: "在时间结束前尽可能多地捕鱼。"
        },
        updated: 20240609
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
        playGifOnMobile: false,
        description: "Navigate through the maze and find the exit.",
        description_i18n: {
            en: "Navigate through the maze and find the exit.",
            es: "Navega por el laberinto y encuentra la salida.",
            fr: "Naviguez dans le labyrinthe et trouvez la sortie.",
            de: "Finde den Ausgang im Labyrinth.",
            zh: "在迷宫中找到出口。"
        },
        updated: 20240609
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
        popularity: 10,
        description: "Documentation and usage instructions for the platform.",
        description_i18n: {
            en: "Documentation and usage instructions for the platform.",
            es: "Documentación e instrucciones de uso para la plataforma.",
            fr: "Documentation et instructions d'utilisation de la plateforme.",
            de: "Dokumentation und Gebrauchsanweisung für die Plattform.",
            zh: "平台的文档和使用说明。"
        },
        updated: 20240609
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
        popularity: 0,
        description: "Trap the mouse before it escapes!",
        description_i18n: {
            en: "Trap the mouse before it escapes!",
            es: "¡Atrapa al ratón antes de que escape!",
            fr: "Attrapez la souris avant qu'elle ne s'échappe !",
            de: "Fange die Maus, bevor sie entkommt!",
            zh: "在老鼠逃跑前把它困住！"
        },
        updated: 20240609
        },
        {
        id: 6,
        name: "PackagePorter",
        name_i18n: {
            en: "PackagePorter",
        },
        author: "Aaron",
        author_i18n: {
            en: "Aaron",
            es: "Aarón",
            fr: "Aaron",
            de: "Aaron",
            zh: "艾伦"
        },
        url: "https://packageporter.u.cname.dev",
        email: "a@example.com",
        tags: ["Aaron","mobile-friendly"],
        popularity: 0,
        description: "Zip Npm packages",
        description_i18n: {
            en: "Zip Npm packages",
        },
        updated: 20250720
        },
    // Add more games...
];

// If playGifOnMobile is not set, default is true
