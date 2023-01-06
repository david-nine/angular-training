import {Action} from "@ngrx/store";

import {Recipe} from "../recipe.model";

export const ADD_RECIPE = '[Recipe] Add Recipe';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';
export const EDIT_RECIPE = '[Recipe] Edit Recipe';
export const SET_RECIPES = '[Recipe] Set Recipes';
export const FETCH_RECIPES = '[Recipe] Fetch Recipes';
export const STORE_RECIPES = '[Recipe] Store Recipes';

export class AddRecipe implements Action {
  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {
  }
}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {
  }
}

export class EditRecipe implements Action {
  readonly type = EDIT_RECIPE;

  constructor(public payload: { id: number, newRecipe: Recipe }) {
  }
}

export class SetRecipes implements Action {
  readonly type = SET_RECIPES;

  constructor(public payload: Recipe[]) {
  }
}

export class FetchRecipes implements Action {
  readonly type = FETCH_RECIPES;

  constructor() {
  }
}

export class StoreRecipes implements Action {
  readonly type = STORE_RECIPES;

  constructor() {
  }
}

export type RecipeActions =
  | AddRecipe
  | DeleteRecipe
  | EditRecipe
  | SetRecipes
  | FetchRecipes
  | StoreRecipes;
