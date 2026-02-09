
# Craft Food Recipe Terminal

A lightweight web app that lists and analyzes **Craft Food (Roblox)** recipes.
Built to quickly compare recipes by cost, earnings, and payback time, with search and ingredient filtering.

## Features

* Search recipes by name
* Filter by required ingredients
* Automatically sorts recipes by payback efficiency
* Displays cost, earnings per second, and calculated payback time
* Fully client-side, no build step

## Tech Stack

* HTML
* CSS
* Vanilla JavaScript
* JSON data source

## How It Works

* Recipes are loaded from `recipes.json`
* Costs and earnings are normalized and sorted by `cost / earnings`
* Filters are applied in real time (search + ingredient chips)
* UI updates dynamically without page reloads

## File Structure

```
├── index.html      # App layout
├── style.css       # Styling
├── app.js          # Logic and filtering
└── recipes.json    # Recipe data
```

## Usage

1. Clone or download the repository
2. Open `index.html` in a browser
3. Use the search bar or ingredient filters to explore recipes

## Notes

* Earnings shown as `/s`
* Recipes with zero earnings display infinite payback
* This tool is fan-made and intended for reference/optimization only

## Credits

Game: Craft Food on Roblox
