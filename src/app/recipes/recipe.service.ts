import {Injectable} from "@angular/core";

import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Chicken',
  //     'Quite good one! Especially with a lot of potatoes!',
  //     'https://realfood.tesco.com/media/images/RFO-October2020-65809-Tesco-LetsCook-Oct20-65850-SpicedChickenGreenBeans1400x919-38f3e9b0-7241-49a3-83fe-fcc38d2c24be-0-1400x919.jpg',
  //     [
  //       new Ingredient('Chicken', 1),
  //       new Ingredient('Potatoes', 5)
  //     ]),
  //   new Recipe(
  //     'Spaghetti',
  //     'Ummm, cheese would be a fitting adding here!',
  //     'https://media.istockphoto.com/photos/spaghetti-in-a-dish-on-a-white-background-picture-id1144823591?s=612x612',
  //     [
  //       new Ingredient('Spaghetti', 1),
  //       new Ingredient('Cheese', 2)
  //     ])
  // ];

  private recipes: Recipe[] = [];

  constructor(private slService: ShoppingListService) {
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice(); // .slice to return a new array (copy)
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(id: number, recipe: Recipe) {
    this.recipes[id] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(id: number) {
    this.recipes.splice(id, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ings: Ingredient[]) {
    this.slService.addIngredients(ings);
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

}
