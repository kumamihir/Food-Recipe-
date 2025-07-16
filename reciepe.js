const searchInput = document.getElementById('recipe-search-input');
const searchButton = document.getElementById('search-btn');
const recipeResultsDiv = document.getElementById('recipe-results');
const initialMessage = document.getElementById('initial-message');
const noResultsMessage = document.getElementById('no-results-message');
const errorMessage = document.getElementById('error-message');
const loadingSpinner = document.getElementById('loading-spinner');

// Modal elements
const recipeDetailModal = document.getElementById('recipe-detail-modal');
const closeModalButton = document.querySelector('.modal .close-button');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredientsList = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');
const modalSourceLink = document.getElementById('modal-source-link');

// Event listeners
searchButton.addEventListener('click', () => {
    fetchRecipes();
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchRecipes();
    }
});

// UI Helpers
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function clearResults() {
    recipeResultsDiv.innerHTML = '';
}

function hideAllMessages() {
    hideElement(initialMessage);
    hideElement(noResultsMessage);
    hideElement(errorMessage);
}

// Fetch and display recipes
async function fetchRecipes() {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        alert('Please enter a recipe name or ingredient!');
        return;
    }

    hideAllMessages();
    clearResults();
    showElement(loadingSpinner);

    try {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        hideElement(loadingSpinner);

        if (!data.meals) {
            showElement(noResultsMessage);
            return;
        }

        displayRecipes(data.meals);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        hideElement(loadingSpinner);
        showElement(errorMessage);
    }
}

// Display fetched recipes as cards
function displayRecipes(recipes) {
    recipes.forEach((meal) => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img">
            <h3 class="recipe-title">${meal.strMeal}</h3>
            <button class="view-btn">View Recipe</button>
        `;

        recipeCard.querySelector('.view-btn').addEventListener('click', () => {
            showRecipeDetail(meal);
        });

        recipeResultsDiv.appendChild(recipeCard);
    });
}

// Show recipe details in modal
function showRecipeDetail(meal) {
    modalTitle.textContent = meal.strMeal;
    modalImage.src = meal.strMealThumb;
    modalInstructions.textContent = meal.strInstructions;
    modalSourceLink.href = meal.strSource || '#';
    modalSourceLink.textContent = meal.strSource ? 'View Original Source' : 'Source Not Available';

    // Clear old ingredients
    modalIngredientsList.innerHTML = '';

    // Add ingredients (up to 20)
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            const li = document.createElement('li');
            li.textContent = `${ingredient} - ${measure}`;
            modalIngredientsList.appendChild(li);
        }
    }

    showElement(recipeDetailModal);
}

// Modal close
closeModalButton.addEventListener('click', () => {
    hideElement(recipeDetailModal);
});
