window.themeConfig = {
    availableThemes: [
        { value: "default", label: "Default", js: null, tags: ["basic"] },
        { value: "dark", label: "Dark", js: "themes/dark.js", tags: ["dark"] },
        { value: "light", label: "Light", js: null, tags: ["light"] },
        { value: "rainbow", label: "Rainbow", js: "themes/rainbow.js", tags: ["dynamic"] },
        { value: "notheme", label: "Notheme", js: null, tags: ["basic"] }
        // Add more themes here as needed, e.g. { value: "mytheme", label: "My Theme", js: "themes/mytheme.js", tags: ["custom"] }
    ],
    defaultTheme: "default",
    tagNames: {
        en: {
            basic: "Basic",
            dark: "Dark",
            light: "Light",
            // ...add more tags as needed
        },
        // Example for Chinese
        zh: {
            basic: "基础",
            dark: "深色",
            light: "浅色",
            // ...add more tags as needed
        }
        // Add more languages as needed
    }
};
