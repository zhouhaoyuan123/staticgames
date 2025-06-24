// rainbow.js
// Theme that changes color every 5 seconds

const colors = [
    "#FF3B30", // Red
    "#FF9500", // Orange
    "#FFCC00", // Yellow
    "#4CD964", // Green
    "#5AC8FA", // Blue
    "#007AFF", // Indigo
    "#5856D6"  // Violet
];

let current = 0;

function applyTheme(color) {
    document.documentElement.style.setProperty('--theme-color', color);
    // Example: update background and text color
    document.body.style.background = color;
    document.body.style.color = "#fff";
}

function cycleTheme() {
    applyTheme(colors[current]);
    current = (current + 1) % colors.length;
}
cycleTheme();
setInterval(cycleTheme, 5000);