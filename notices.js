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
            canClose: true,
            lastMod: 1,
            content: {
                en: "Welcome to the platform! Enjoy our games. See the <a href='https://codeberg.org/zhou2012/StaticGames'>repo</a>. <a href='https://staticgames.rf.gd/poll/index.php/846812?lang=en'>Feedback channel</a> Note: The page might refresh when you change themes, so save your data first! \
                If you have any suggestions or issues, please submit them via <a href='https://codeberg.org/zhou2012/StaticGames/issues'>issues</a>.",
                es: "¡Bienvenido a la plataforma! Disfruta de nuestros juegos. Consulta el <a href='https://codeberg.org/zhou2012/StaticGames'>repositorio</a>. Note : La página puede refrescarse al cambiar de tema, ¡así que guarda tus datos primero!",
                fr: "Bienvenue sur la plateforme ! Profitez de nos jeux. Voir le <a href='https://codeberg.org/zhou2012/StaticGames'>dépôt</a>. Note : La page peut se rafraîchir lorsque vous changez de thème, donc sauvegardez vos données d'abord !",
                de: "Willkommen auf der Plattform! Viel Spaß mit unseren Spielen. Siehe das <a href='https://codeberg.org/zhou2012/StaticGames'>Repository</a>. <a href='https://staticgames.rf.gd/poll/index.php/846812?lang=de'>Feedback-Kanal</a> Hinweis: Die Seite könnte sich aktualisieren, wenn Sie das Thema wechseln, also speichern Sie zuerst Ihre Daten! ",
                zh: "欢迎来到平台！尽情享受我们的游戏。请访问我们的<a href='https://codeberg.org/zhou2012/StaticGames'>仓库</a>。 <a href='https://staticgames.rf.gd/poll/index.php/356943?lang=zh-Hans'>反馈通道</a>切换主题前请先保存自己的进度！ 欢迎投稿至 zhouhaoyuan2012@foxmail.com \
                如果您有任何建议或意见，请通过 <a href='https://codeberg.org/zhou2012/StaticGames/issues'>issues</a> 提交。"
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
        },
        {
            id: "about",
            type: "info",
            canClose: true,
            content: {
                en: "This platform is a collection of HTML5 games and demos. It is open-source and available on <a href='https://codeberg.org/zhou2012/StaticGames'>Codeberg</a>.",
                es: "Esta plataforma es una colección de juegos y demos HTML5. Es de código abierto y está disponible en <a href='https://codeberg.org/zhou2012/StaticGames'>Codeberg</a>.",
                fr: "Cette plateforme est une collection de jeux et démos HTML5. Elle est open-source et disponible sur <a href='https://codeberg.org/zhou2012/StaticGames'>Codeberg</a>.",
                de: "Diese Plattform ist eine Sammlung von HTML5-Spielen und Demos. Sie ist Open-Source und auf <a href='https://codeberg.org/zhou2012/StaticGames'>Codeberg</a> verfügbar.",
                zh: "该平台是一个HTML5游戏和演示的集合。它是开源的，并可在<a href='https://codeberg.org/zhou2012/StaticGames'>Codeberg</a>上获取。"
            }
        },
        // add more here
    ]
};
