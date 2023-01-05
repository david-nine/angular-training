import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {exhaustMap, map, take, tap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";

import {Recipe} from "../recipes/recipe.model";
import {RecipeService} from "../recipes/recipe.service";
import {Ingredient} from "./ingredient.model";
import {AuthService} from "../auth/auth.service";
import * as fromApp from "../store/app.reducer";

@Injectable({providedIn: 'root'})
export class DataStorageService {

  readonly RECIPES_URL = 'recipes';
  readonly SHOPPING_LIST_URL = 'ingredients';

  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
  }

  storeData() {
    this.http.put(this.RECIPES_URL, this.recipesService.list()).subscribe();
    this.store.select('shoppingList').pipe(
      take(1),
      map(state => state.ingredients)
    ).subscribe(ingredients => this.http.put(
      this.SHOPPING_LIST_URL,
      ingredients
    ).subscribe());
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap(() => {
        return this.http.get<{ [key: string]: Recipe }>(this.RECIPES_URL)
      }),
      map(responseData => {
        const recipes = this.mapFirebaseResponse(responseData);
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        });
      }),
      tap(recipes => this.recipesService.fetch(recipes))
    );
  }

  fetchShoppingList() {
    return this.http.get<{ [key: string]: Ingredient }>(this.SHOPPING_LIST_URL)
      .pipe(
        map(responseData => this.mapFirebaseResponse(responseData)),
      );
  }

  mapFirebaseResponse(responseData: any) {
    const postArray = [];
    let id = 0;
    for (const key in responseData) {
      if (responseData.hasOwnProperty(key)) {
        postArray.push({...responseData[key], id: id++});
      }
    }
    return postArray;
  }
}
