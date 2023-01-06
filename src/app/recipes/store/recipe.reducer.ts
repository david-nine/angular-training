import * as RecipeActions from './recipe.action';
import {Recipe} from "../recipe.model";

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(state: State = initialState, action: any) {
  return recipeReduce(state, action);
}

function recipeReduce(state: State, action: RecipeActions.RecipeActions) {
  switch (action.type) {
    case RecipeActions.ADD_RECIPE:
      const newRecipe = {
        ...action.payload,
        id: getLastId(state.recipes) + 1
      };

      return {
        ...state,
        recipes: [...state.recipes, newRecipe]
      }
    case RecipeActions.EDIT_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.id],
        ...action.payload.newRecipe
      };
      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.id] = updatedRecipe;

      return {
        ...state,
        recipes: updatedRecipes
      }
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id != action.payload)
      }
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    default:
      return state
  }
}

const getLastId = (recipes: Recipe[]) => {
  let id = 0;
  for (let recipe of recipes) {
    if (recipe.id && recipe.id > id) {
      id = recipe.id;
    }
  }
  return id;
}
