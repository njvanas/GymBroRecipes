# GymBroRecipes

This project contains a minimal React + Vite setup for a fitness tracker.

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

The production build outputs static files to the `dist` folder.

## Netlify Deploy

Netlify uses `netlify.toml` for the build. The Vite entry file `index.html`
resides at the project root, and the SPA redirects are handled via
`public/_redirects` so that direct navigation to routes works correctly.
