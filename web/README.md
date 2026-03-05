# SieveAi Website

This is the official website for SieveAi - a local-first AI code review CLI/TUI.

## Tech Stack

- **React** - UI library
- **Vite** - Build tool & dev server
- **Framer Motion** - Animation library
- **CSS** - Custom styling with CSS variables

## Development

```bash
# From project root
npm run web:dev

# Or from web folder
cd web
npm run dev
```

The dev server will start at `http://localhost:5173`

## Build

```bash
# From project root
npm run web:build

# Or from web folder
cd web
npm run build
```

Build output will be in `web/dist/`

## Preview Production Build

```bash
# From project root
npm run web:preview

# Or from web folder
cd web
npm run preview
```

## Project Structure

```
web/
├── src/
│   ├── components/          # React components
│   │   ├── Architecture.jsx
│   │   ├── Features.jsx
│   │   ├── Footer.jsx
│   │   ├── GeometricBackground.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── QuickStart.jsx
│   │   └── Terminal.jsx
│   ├── styles/
│   │   └── App.css         # Main stylesheet
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Dependencies
```

## Assets

The website uses assets from the parent `sieveAssets` folder (logo.png and banner_f.png). The Vite config is set up to use this folder as the public directory.

## Design Philosophy

The website embodies a **technical brutalism with signal processing aesthetics** approach:

- **Black/white/grey color scheme** with **orange accents** matching the brand
- **Geometric animations** representing signal filtering
- **Monospace typography** (Azeret Mono + Roboto Mono) for technical precision
- **Clipped corners** on interactive elements for a technical/cut aesthetic
- **Animated background** with scanning lines and noise particles
- **Smooth scroll animations** using Framer Motion

## Customization

Key design tokens are defined as CSS variables in `src/styles/App.css`:

```css
:root {
  --black: #000000;
  --signal-orange: #ff6b35;
  --light-grey: #808080;
  /* ... etc */
}
```

Modify these to adjust the color scheme throughout the site.
