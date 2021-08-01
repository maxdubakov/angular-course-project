import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class DataStorageService {

  url = 'https://course-project-2d861-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private httpClient: HttpClient,
              private recipeService: RecipeService) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient
      .put(`${this.url}/recipes.json`, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.httpClient
      .get<Recipe[]>(`${this.url}/recipes.json`)
      .pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));
  }
}
