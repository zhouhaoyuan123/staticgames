
# Theme System

This platform supports multiple themes that can be loaded via URL parameters.

## Usage

Add the `theme` parameter to the URL to load a specific theme:

- Default theme: `index.html` or `index.html?theme=default`
- Dark theme: `index.html?theme=dark`
- Light theme: `index.html?theme=light`

## Available Themes

- **default**: The original theme (uses styles.css)
- **dark**: Dark mode with darker backgrounds and light text
- **light**: Enhanced light theme with improved colors and shadows

## Creating Custom Themes

1. Create a new CSS file in the `themes/` directory (e.g., `themes/myTheme.css`)
2. Copy the structure from `themes/dark.css` or `themes/light.css`
3. Modify colors, fonts, and styling as desired
4. Access your theme via `index.html?theme=myTheme`

## Fallback Behavior

If a theme file doesn't exist, the system will automatically fall back to the default theme and display a warning in the console.