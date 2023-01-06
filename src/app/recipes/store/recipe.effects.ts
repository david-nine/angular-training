import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

import * as RecipesActions from './recipe.action';
import {Recipe} from "../recipe.model";
import * as fromApp from '../../store/app.reducer';

const RECIPES_URL = 'recipes';

const mapFirebaseResponse = (responseData: { [key: string]: Recipe }) => {
  const postArray = [];
  let id = 0;
  for (const key in responseData) {
    if (responseData.hasOwnProperty(key)) {
      postArray.push({...responseData[key], id: id++});
    }
  }
  return postArray;
}

@Injectable()
export class RecipeEffects {

  fetchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<{ [key: string]: Recipe }>(RECIPES_URL).pipe(
          catchError(err => {
            return of({})
          })
        )
      }),
      map((responseData: { [key: string]: Recipe }) => {
        const recipes = mapFirebaseResponse(responseData);
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
        });
      }),
      map((recipes: Recipe[]) => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  })

  storeRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipe')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put(RECIPES_URL, recipesState.recipes)
      })
    )
  }, {dispatch: false})

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {
  }

}
