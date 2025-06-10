// This script runs in a Web Worker context

// On init, send CSS variables for dark mode to the main thread
onmessage = function(e) {
    if (e.data && e.data.type === "init") {
        postMessage({
            cssVars: {
                "--background-color": "#181a1b",
                "--text-color": "#f1f1f1",
                "--header-bg": "#23272a",
                "--card-bg": "#23272a",
                "--border-color": "#333",
                "--primary-color": "#2196f3",
                "--tag-bg": "#333",
                "--tag-active-bg": "#2196f3",
                "--tag-active-color": "#fff"
            }
        });
    }
};
