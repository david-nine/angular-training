import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {Store} from "@ngrx/store";
import {Actions, ofType} from "@ngrx/effects";
import {map, switchMap, take} from "rxjs/operators";

import {Recipe} from "./recipe.model";
import * as fromApp from '../store/app.reducer';
import * as RecipesActions from './store/recipe.action';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(
    private store: Store<fromApp.AppState>,
    private actions$: Actions
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select('recipe').pipe(
      map(recipesState => recipesState.recipes),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new RecipesActions.FetchRecipes());
          return this.actions$.pipe(
            ofType(RecipesActions.SET_RECIPES),
            take(1));
        } else {
          return of(recipes);
        }
      })
    )
  }
}
