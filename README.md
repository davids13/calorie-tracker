# 🍎 Calorie Tracker

A simple, dependency-free calorie tracking web app. No build step, no server, no accounts.

## Features
- Add foods with a name, calorie count, protein, carbs, fat, and salt (grams)
- See total calories, protein, carbs, fat, and salt consumed vs. your daily goals, each with a progress bar
- Editable daily calorie, protein, carbs, fat, and salt goals
- Delete individual entries or clear the whole day
- **Last 7 days** view: average calories/protein per logged day, plus a bar chart of daily calories (today included)
- **Timeline** of past days showing each day's total calories (with a mini progress bar vs. your goal) and total protein — tap a day to expand and see its individual foods
- **Barcode scanning** — scan a product barcode with your camera (or type the number) to auto-fill name, calories, protein, carbs, fat, and salt from the free [Open Food Facts](https://world.openfoodfacts.org) database
- **Export to Excel** — download all logged data (every day, per food + daily totals) as a CSV file that opens directly in Excel
- **Light / dark theme** — toggle the 🌙/☀️ button in the header; your choice is remembered (localStorage)
- Data saved per-day in your browser (localStorage) — reopening keeps today's log

## Usage
Open `index.html` in any modern browser (double-click it), or serve the folder:

```bash
# optional: run a local server
python3 -m http.server 8000
# then visit http://localhost:8000
```

> **Barcode scanning:** the live camera scanner needs a secure context (HTTPS or `localhost`) and a browser that supports the `BarcodeDetector` API (e.g. Chrome/Edge). When opened directly as a `file://` page, the camera may be blocked — in that case use the **manual barcode entry** field in the scan dialog, which works everywhere. Product data comes from Open Food Facts and requires an internet connection.

## Files
- `index.html` — markup
- `styles.css` — styling
- `app.js` — logic and localStorage persistence

Your data stays on your device. Each day starts a fresh log automatically.
