window.noticesConfig = {
    // Header translations for "Notice"
    header: {
        en: "Notice",
        es: "Aviso",
        fr: "Avis",
        de: "Hinweis",
        zh: "公告"
    },
    // Array of notices, each with translations
    notices: [
        {
            id: 1,
            type: "info",
            content: {
                en: "Welcome to the platform! Enjoy our games. <a href='https://staticgames.rf.gd/poll/index.php/846812?lang=en'>Feedback channel</a> ",
                es: "¡Bienvenido a la plataforma! Disfruta de nuestros juegos.",
                fr: "Bienvenue sur la plateforme ! Profitez de nos jeux.",
                de: "Willkommen auf der Plattform! Viel Spaß mit unseren Spielen.",
                zh: "欢迎来到平台！尽情享受我们的游戏。 <a href='https://staticgames.rf.gd/poll/index.php/356943?lang=zh-Hans'>反馈通道</a>"
            }
        },
        {
            id: "lang-theme-warning",
            type: "warning",
            content: {
                en: "The language or theme specified in the URL was not found and the default was used.",
                es: "El idioma o tema especificado en la URL no se encontró y se usó el valor predeterminado.",
                fr: "La langue ou le thème spécifié dans l'URL est introuvable, la valeur par défaut a été utilisée.",
                de: "Die in der URL angegebene Sprache oder das Thema wurde nicht gefunden. Standard wurde verwendet.",
                zh: "URL中指定的语言或主题未找到，已使用默认设置。"
            },
            shouldShow: function() {
                return !!window._showLangThemeWarning;
            }
        }
        // add more here
    ]
};
