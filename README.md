# 🍎 Calorie Tracker

A simple, dependency-free calorie tracking web app. No build step, no server, no accounts.

## Features
- Add foods with a name, calorie count, protein, carbs, fat, and salt (grams). A **name** and a **protein** value are required; calories, carbs, fat, and salt are optional and default to 0
- See total calories, protein, carbs, fat, and salt consumed vs. your daily goals, each with a progress bar
- Editable daily calorie, protein, carbs, fat, and salt goals
- Delete individual entries or clear the whole day
- A brief success banner confirms each time a food entry is added
- **Last 7 days** view: average calories/protein per logged day, plus a bar chart of daily calories (today included)
- **Timeline** of past days showing each day's total calories (with a mini progress bar vs. your goal) and total protein — tap a day to expand and see its individual foods
- **Barcode scanning** — scan a product barcode with your camera (or type the number) to auto-fill name, calories, protein, carbs, fat, and salt from the free [Open Food Facts](https://world.openfoodfacts.org) database
- **Export to Excel** — download all logged data (every day, per food + daily totals) as a CSV file that opens directly in Excel
- **Backup & Restore** — move your data between devices without a server: **Backup** downloads a JSON file of all your data, and **Restore** imports it on another device (see [Using it on multiple devices](#using-it-on-multiple-devices))
- **Light / dark theme** — toggle the 🌙/☀️ button in the header; your choice is remembered (localStorage)
- **Mobile responsive** — adapts to phones and tablets: safe-area support for notched devices, larger touch targets, single-column entry form, and reflowed grids/charts on small screens
- Data saved per-day in your browser (localStorage) — reopening keeps today's log

## Usage
Open `index.html` in any modern browser (double-click it), or serve the folder:

```bash
# optional: run a local server
python3 -m http.server 8000
# then visit http://localhost:8000
```

> **Barcode scanning:** the live camera scanner needs a secure context (HTTPS or `localhost`) and a browser that supports the `BarcodeDetector` API (e.g. Chrome/Edge). When opened directly as a `file://` page, the camera may be blocked — in that case use the **manual barcode entry** field in the scan dialog, which works everywhere. Product data comes from Open Food Facts and requires an internet connection.

## Using it on multiple devices
The app stores everything in your browser's `localStorage`, which is local to **one browser on one device** and is not synced automatically (even by browser account sync). To move your data to another device — including when hosting on **GitHub Pages**, which is static-only with no backend — use **Backup & Restore**:

1. On the first device, click **Backup** in the footer — this downloads a `calorie-tracker-backup-YYYY-MM-DD.json` file with all your data.
2. Transfer the file to the other device (AirDrop, iCloud/Google Drive, email, etc.).
3. On the second device, open the app and click **Restore**, choose the file, and confirm. The app validates the file, imports the data, and reloads.

Notes:
- Only Calorie Tracker data (`cal-*` and `wt-*` keys) is included, so other projects sharing the same `username.github.io` origin are left untouched.
- Restore **replaces** matching data on the target device, so back that device up first if it has data you want to keep.
- This is a manual, file-based transfer — there is no automatic real-time sync (that would require an external service or backend).

## Responsive design
The layout is mobile-first and adapts across screen sizes (feature: `make-mobile-responsive`):
- **Safe-area support** — `viewport-fit=cover` plus `env(safe-area-inset-*)` padding so content clears notches and rounded corners on modern phones
- **Comfortable touch targets** — buttons and controls have a minimum 44px tap size, with `touch-action: manipulation` to avoid double-tap zoom delays
- **Phones (≤480px)** — the add-food form collapses to a single column, goal and weekly-average grids switch to two columns, inputs use a 16px font to prevent iOS auto-zoom on focus, the footer wraps, and the barcode entry stacks
- **Small phones (≤360px)** — grids collapse to a single column and list rows tighten up
- **Landscape / short screens** — vertical spacing and chart height are reduced so controls stay reachable
- **Tablets (≥700px)** — the card widens slightly for more breathing room

## Files
- `index.html` — markup
- `styles.css` — styling
- `app.js` — logic and localStorage persistence

Your data stays on your device. Each day starts a fresh log automatically.
