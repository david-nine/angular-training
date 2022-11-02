import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";

import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Ingredient } from "./ingredient.model";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    readonly RECIPES_URL = 'recipes';
    readonly SHOPPING_LIST_URL = 'ingredients';

    constructor(
        private http: HttpClient,
        private recipesService: RecipeService,
        private shoppoingListService: ShoppingListService
    ) { }

    storeData() {
        this.http.put(this.RECIPES_URL, this.recipesService.list()).subscribe();
        this.http.put(this.SHOPPING_LIST_URL, this.shoppoingListService.list()).subscribe();
    }

    fetchRecipes(): Observable<Recipe[]> {
        return this.http.get<{ [key: string]: Recipe }>(this.RECIPES_URL)
            .pipe(
                map(responseData => {
                    const recipes = this.mapFirebaseResponse(responseData);
                    return recipes.map(recipe => {
                        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
                    });
                }),
                tap(recipes => this.recipesService.fetch(recipes))
            );
    }

    fetchShoppingList() {
        return this.http.get<{ [key: string]: Ingredient }>(this.SHOPPING_LIST_URL)
            .pipe(
                map(responseData => this.mapFirebaseResponse(responseData)),
                tap(recipes => this.shoppoingListService.fetch(recipes))
            );
    }

    mapFirebaseResponse(responseData: any) {
        const postArray = [];
        let id = 0;
        for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
                postArray.push({ ...responseData[key], id: id++ });
            }
        }
        return postArray;
    }
}