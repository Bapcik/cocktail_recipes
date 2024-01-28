const form = document.querySelector("form");
const cocktailName = document.querySelector(".username");
const cocktailList = document.querySelector(".cocktail-list");
const recipe = document.querySelector(".recipe");
const recipeContainer = document.querySelector(".recipe-container");
const close = document.querySelector(".close");
const loader = document.querySelector(".lds-heart");

const dataCocktail = async (name) => {
  const urlInfoCocktail = await fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
  );
  const cocktail = await urlInfoCocktail.json();
  return cocktail.drinks;
};

const imgProduct = async (product) => {
  const urlImgProduct = await fetch(
    `https://www.thecocktaildb.com/images/ingredients/${product}-Small.png`
  );

  const imgBlob = await urlImgProduct.blob();
  return URL.createObjectURL(imgBlob);
};

const result = (cocktails) => {
  cocktailList.innerHTML = "";

  for (const element of cocktails) {
    const elementDiv = document.createElement("div");
    elementDiv.classList.add("cocktail");
    elementDiv.innerHTML = `
      <h3>${element.strDrink}</h3>
      <img src="${element.strDrinkThumb}" alt="${element.strDrink}">
    `;
    cocktailList.append(elementDiv);

    elementDiv.addEventListener("click", async () => {
      recipeContainer.innerHTML = "";
      const recipeProduct = document.createElement("div");
      const ingredients = [];
      for (let i = 1; i <= 15; i++) {
        if (element[`strIngredient${i}`]) {
          const measuring = element[`strMeasure${i}`] || " ";
          const productImg = element[`strIngredient${i}`];

          const img = await imgProduct(productImg);
          ingredients.push(`
            <img src="${img}" alt="${productImg}">
            ${element[`strIngredient${i}`]} ${measuring}
          `);
        } else {
          break;
        }
      }

      recipeProduct.innerHTML = `
        <h3>Информация о коктейле:</h3> 
        <h2>${element.strDrink}</h2>
        <h3>Ингредиенты:</h3>
        <ul>${ingredients.map((product) => `<li>${product}</li>`).join("")}</ul>
        <h3>Рецепт:</h3>
        <p>${element.strInstructions}</p>
      `;
      recipeContainer.append(recipeProduct);
      recipe.style.display = "block";
    });
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cocktail = cocktailName.value;
  if (!cocktail) {
    alert("Введите название коктеля!");
    return;
  }
  loader.style.display = "block";
  const cocktails = await dataCocktail(cocktail);
  result(cocktails);
  loader.style.display = "none";
});

close.addEventListener("click", () => {
  recipe.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event !== recipe) {
    recipe.style.display = "none";
  }
});
