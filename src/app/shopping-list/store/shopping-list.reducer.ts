import {Ingredient} from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)]
};

export function shoppingListReducer(
  state: { ingredients: Ingredient[] } = initialState,
  action: any
) {
  return reduceShoppingList(state, action);
}

function reduceShoppingList(state: { ingredients: Ingredient[] }, action: ShoppingListActions.ShoppingListAActionsType) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: saveOrUpdate(action.payload, [...state.ingredients])
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      let newIngredients = [...state.ingredients];
      for (let i = 0; i < action.payload.length; i++) {
        newIngredients = saveOrUpdate({...action.payload[i]}, newIngredients);
      }
      return {
        ...state,
        ingredients: newIngredients
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      }
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((value, index) => index !== action.payload)
      };
    default:
      return state;
  }
}

function saveOrUpdate(ingredient: Ingredient, ingredients: Ingredient[]) {
  let index = getIndexOfIngredientByName(ingredients, ingredient.name);
  if (index != null) {
    ingredients[index] = new Ingredient(ingredients[index].name,
      ingredients[index].amount + ingredient.amount);
  } else {
    ingredients.push(ingredient);
  }
  return ingredients;
}

function getIndexOfIngredientByName(ingredients: Ingredient[], name: string) {
  const ingredient = ingredients.filter(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  return ingredient[0] ? ingredients.indexOf(ingredient[0]) : null;
}
