// Retrieve favorite meals from localStorage
const favoriteMeals = JSON.parse(localStorage.getItem("favoriteMeals")) || [];



// Function to save favorite meals to localStorage
const saveFavoriteMealsToLocalStorage = () => {
  localStorage.setItem("favoriteMeals", JSON.stringify(favoriteMeals));
};

// Function to add favorite meals to favourite page,localStorage
const addToFavorites = (meal) => {
  if (!isMealInFavorites(meal)) {
    favoriteMeals.push(meal);
  } else {
    alert(" Meal is already added in favourite meal page");
  }

  // Save the updated favorite meals to localStorage
  saveFavoriteMealsToLocalStorage();
  // Refresh the favorite meals on both pages
  displayFavoriteMeals();
};

// Function to remove a meal from favorites
const removeFromFavorites = (meal) => {
  const mealIndex = favoriteMeals.findIndex((favMeal) => favMeal.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favoriteMeals.splice(mealIndex, 1);
    // Save the updated favorite meals to localStorage
    saveFavoriteMealsToLocalStorage();
    // Refresh the favorite meals on both pages
    displayFavoriteMeals();
  }
};

// Function to check if a meal is already in favorites
const isMealInFavorites = (meal) => {
  return favoriteMeals.some((favMeal) => favMeal.idMeal === meal.idMeal);
};

// Function to Create Favourite meal Item
const createFavoriteMealItem = (meal) => {
  const card = document.createElement("div");
  card.classList.add("FavMealCard");

  card.innerHTML = `
  <img src="${meal.strMealThumb}" >
  <h3>${meal.strMeal}</h3>
  <p><span>${meal.strArea}</span> Dish</p>
  <p>Belongs to <span>${meal.strCategory}</span> Category</p>
  `;

  // create remove button
  const removeFavBtn = document.createElement('button');
  removeFavBtn.textContent = "Remove";
  card.appendChild(removeFavBtn);

  // Add an event listener to the "Remove" button to remove the meal from favorites page
  removeFavBtn.addEventListener('click', () => {
    removeFromFavorites(meal);
    card.remove(); // Remove the card from the display
  });

  return card;
};

// Function to display favorite meals on the main page
const displayFavoriteMeals = () => {
  const favMealList = document.querySelector(".fav-meal-list");

  favMealList.innerHTML = "";
  // Check if there are favorite meals
  if (favoriteMeals.length === 0) {
    favMealList.innerHTML = "<h2>No favorite meals added yet.</h2>";
  } else {
    // Iterate through the favorite meals and display them
    favoriteMeals.forEach((meal) => {
      const favoriteMealItem = createFavoriteMealItem(meal);
      favMealList.appendChild(favoriteMealItem);
    });
  }
};



// Selectors
const searchBox = document.querySelector('.search-box');
const mealsContainer = document.querySelector('.meals-container');
const searchBtn = document.getElementById('search-btn');
const viewDetails = document.querySelector('.view-details');
const detailsContent = document.querySelector('.details-content');
const viewDetailCloseBtn = document.querySelector('.viewDetails-closeBtn');
const favHeading = document.querySelector('.favoMealHeading');
const favMealContainer = document.querySelector('.fav-meal-container');
const favMealList = document.querySelector('.fav-meal-list');
const favPagecloseBtn = document.querySelector('favPage-closeBtn');


//  function to get meals
const fetchMeals = async (query) => {
  mealsContainer.innerHTML = "<h2>Fetching Meals ........</h2>";
  try {
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    mealsContainer.innerHTML = "";

    response.meals.forEach((meal) => {
      //  create recipe meal card 
      const recipeDiv = document.createElement('div');
      recipeDiv.classList.add('recipe');

      recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}" >
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs to <span>${meal.strCategory}</span> Category</p>
      `;
      // create  button for view meal details
      const buttonDetails = document.createElement('button');
      buttonDetails.textContent = "View Details";
      recipeDiv.appendChild(buttonDetails);

      //adding EventListener for meal detail button
      buttonDetails.addEventListener('click', () => {
        openDetailsPop(meal);
      });


      //  create  button for add meal in favourite page 
      const buttonFavorite = document.createElement('button');
      buttonFavorite.innerHTML = ` <i class="fa-regular fa-heart"></i> `;
      recipeDiv.appendChild(buttonFavorite);

      //adding EventListener for add fav meal button
      buttonFavorite.addEventListener('click', (e) => {

        const heartIcon = buttonFavorite.querySelector('i.fa-regular');
        heartIcon.setAttribute('class', 'fa-solid fa-heart');
        addToFavorites(meal);



      });

      mealsContainer.appendChild(recipeDiv);
    });
  } catch (error) {
    mealsContainer.innerHTML = "<h2>Not found......</h2>";
  }
};

// Function to fetch ingredients and measurements
const fetchIngredients = (meal) => {
  let ingredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientsList;
};

//  function to open Details page Pop
const openDetailsPop = (meal) => {
  detailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <div class="recipeInstructions">
      <h3>Instructions:</h3>
      <p>${meal.strInstructions}</p>
    </div>
    <h3>Ingredients:</h3>
    <ul class="ingredientlist">${fetchIngredients(meal)}</ul>
  `;

  detailsContent.parentElement.style.display = "block";
};
// adding addEventListener for view details meal page
viewDetailCloseBtn.addEventListener('click', (e) => {
  detailsContent.parentElement.style.display = "none";
});


//  adding addEventListener for favourite meal heading  to open favourite meal
favHeading.addEventListener('click', () => {
  openFavoriteItemPop();
});

// function for  favourite page popup
const openFavoriteItemPop = () => {
  favMealList.parentElement.style.display = "block";
}
// function for  favourite page popup close butten
function favPageClose() {
  favMealList.parentElement.style.display = "none";
}
// adding addEventListener for search button
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  if (searchInput) {
    fetchMeals(searchInput);
  } else {
    alert("Please enter a search query");
  }
});

displayFavoriteMeals();  // call 


