# Ultimate Fitness Tracker

Ultimate Fitness Tracker is an offline‑first progressive web app (PWA) for logging workouts, tracking nutrition and monitoring body metrics. All data is saved locally in your browser using IndexedDB. Paying users can optionally sync their data to the cloud via Supabase for backup and multi‑device access.

## Features
- Plan and log workouts
- Track macros and meals
- Record body metrics like weight and body fat
- View progress charts
- Installable PWA that works offline
- Optional cloud sync for paid users

## Local Setup
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in your Supabase and Stripe keys. If
   these values are omitted the app still works offline, but cloud sync features
   will be disabled.
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Build & Deploy
Build the optimized production assets with:
```bash
npm run build
```
The static files will be generated in the `dist` folder.

### GitHub Pages
The repository includes a GitHub Actions workflow that publishes `dist` to the `gh-pages` branch whenever you push to `main`.
Remember to provide `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` during the build if you want cloud sync enabled in the deployed site.

### Netlify (optional)
If you prefer Netlify, connect the repo in your Netlify dashboard or deploy manually with the Netlify CLI:
```bash
netlify deploy --dir=dist --prod
```
Make sure to configure the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables
in your Netlify environment settings so the frontend can connect to your Supabase
project after deployment.

## Privacy & Data Ownership
All data stays on your device unless you enable cloud sync. There are no analytics or third‑party trackers. You can export or delete your information at any time and you remain the sole owner of your data.

## License
Released under the [MIT License](LICENSE).
