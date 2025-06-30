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
                en: "Welcome to the platform! Enjoy our games. See the <a href='https://codeberg.org/zhou2012/StaticGames'>repo</a>. <a href='https://staticgames.rf.gd/poll/index.php/846812?lang=en'>Feedback channel</a> Note: The page might refresh when you change themes, so save your data first! ",
                es: "¡Bienvenido a la plataforma! Disfruta de nuestros juegos. Consulta el <a href='https://codeberg.org/zhou2012/StaticGames'>repositorio</a>. Note : La página puede refrescarse al cambiar de tema, ¡así que guarda tus datos primero!",
                fr: "Bienvenue sur la plateforme ! Profitez de nos jeux. Voir le <a href='https://codeberg.org/zhou2012/StaticGames'>dépôt</a>. Note : La page peut se rafraîchir lorsque vous changez de thème, donc sauvegardez vos données d'abord !",
                de: "Willkommen auf der Plattform! Viel Spaß mit unseren Spielen. Siehe das <a href='https://codeberg.org/zhou2012/StaticGames'>Repository</a>. <a href='https://staticgames.rf.gd/poll/index.php/846812?lang=de'>Feedback-Kanal</a> Hinweis: Die Seite könnte sich aktualisieren, wenn Sie das Thema wechseln, also speichern Sie zuerst Ihre Daten!",
                zh: "欢迎来到平台！尽情享受我们的游戏。请访问我们的<a href='https://codeberg.org/zhou2012/StaticGames'>仓库</a>。 <a href='https://staticgames.rf.gd/poll/index.php/356943?lang=zh-Hans'>反馈通道</a>切换主题前请先保存自己的进度！"
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
