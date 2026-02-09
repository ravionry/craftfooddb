/* =====================================================
   DOM REFERENCES
   Cache frequently used elements.
   ===================================================== */

const grid = document.getElementById("grid");
const search = document.getElementById("search");
const ingredientDiv = document.getElementById("ingredientFilters");


/* =====================================================
   STATE
   Stores all recipes and active ingredient filters.
   ===================================================== */

let ALL = [];
let selectedIngredients = new Set();


/* =====================================================
   INGREDIENT EMOJI MAP
   Maps ingredient names to emojis. Extend as needed.
   ===================================================== */

const ingredientEmoji = {
    Flour: "🌾",
    Milk: "🥛",
    Egg: "🥚",
    Sugar: "🍬",
    Rice: "🍚",
    Potato: "🥔",
    Carrot: "🥕",
    Tomato: "🍅",
    Lettuce: "🥬",
    Meat: "🍖",
    Lemon: "🍋",
    Strawberry: "🍓",
    Banana: "🍌",
    Blueberry: "🫐",
    Cacao: "🍫",
    Fish: "🐟",
    Bean: "🫘"
};


/* =====================================================
   NUMBER FORMATTER
   Formats large numbers using compact notation.
   ===================================================== */

const formatter = new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
});

function formatNumber(num) {
    if (!Number.isFinite(num))
        return "∞";

    return formatter.format(num);
}


/* =====================================================
   LOAD DATA
   Fetch recipes, normalize numeric values, sort by
   payback efficiency, then initialize UI.
   ===================================================== */

fetch("recipes.json")
    .then(r => r.json())
    .then(data => {

        data = data.map(r => ({
            ...r,
            cost: parseFloat(r.cost),
            earnings: parseFloat(r.earnings)
        }));

        data.sort((a, b) =>
            (a.cost / a.earnings) -
            (b.cost / b.earnings)
        );

        ALL = data;

        createIngredientFilters(data);
        render(data);
    });


/* =====================================================
   INGREDIENT FILTERS
   Generates selectable filter chips with emojis.
   ===================================================== */

function createIngredientFilters(data) {

    const unique = new Set();

    data.forEach(r =>
        r.ingredients.forEach(i => unique.add(i))
    );

    unique.forEach(ingredient => {

        const emoji = ingredientEmoji[ingredient] || "🍽️";

        const btn = document.createElement("button");
        btn.className = "chip";
        btn.innerText = `${emoji} ${ingredient}`;

        btn.onclick = () => {

            btn.classList.toggle("active");

            if (selectedIngredients.has(ingredient))
                selectedIngredients.delete(ingredient);
            else
                selectedIngredients.add(ingredient);

            applyFilters();
        };

        ingredientDiv.appendChild(btn);
    });
}


/* =====================================================
   FILTER PIPELINE
   Applies search term and ingredient filters.
   ===================================================== */

function applyFilters() {

    let filtered = ALL;

    const term = search.value.toLowerCase();

    filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(term)
    );

    if (selectedIngredients.size) {

        filtered = filtered.filter(recipe =>
            [...selectedIngredients]
                .every(i => recipe.ingredients.includes(i))
        );
    }

    render(filtered);
}


/* =====================================================
   RENDER
   Displays recipe cards with ingredient tags and stats.
   ===================================================== */

function render(list) {

    if (!list.length) {
        grid.innerHTML = "<p>No recipes found.</p>";
        return;
    }

    grid.innerHTML = list.map(r => {

        const payback =
            r.earnings > 0
                ? r.cost / r.earnings
                : Infinity;

        const tags = r.ingredients
            .map(i => {

                const emoji = ingredientEmoji[i] || "🍽️";

                return `<span class="tag">${emoji} ${i}</span>`;
            })
            .join("");

        return `
        <div class="card">

            <h3>${r.name}</h3>

            ${tags}

            <div class="stat">
                <span>💰</span>
                <span>Cost</span>
                <span>$${formatNumber(r.cost)}</span>
            </div>

            <div class="stat">
                <span>⚡</span>
                <span>Earnings</span>
                <span>$${formatNumber(r.earnings)}/s</span>
            </div>

            <div class="stat">
                <span>⏱</span>
                <span>Payback</span>
                <span>${
                    Number.isFinite(payback)
                        ? payback.toFixed(2) + "s"
                        : "∞"
                }</span>
            </div>

        </div>`;
    }).join("");
}


/* =====================================================
   SEARCH LISTENER
   Triggers filtering on user input.
   ===================================================== */

search.addEventListener("input", applyFilters);