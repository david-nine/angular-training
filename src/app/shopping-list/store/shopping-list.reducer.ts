import {Ingredient} from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';
import {AddIngredients, UpdateIngredient} from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  editedIngredientIndex: number;
}


const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  state: State = initialState,
  action: any
) {
  return reduceShoppingList(state, action);
}

function reduceShoppingList(state: State, action: ShoppingListActions.ShoppingListAActionsType) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: saveOrUpdate(action.payload, [...state.ingredients])
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: addIngredients(state, action)
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      return {
        ...state,
        ingredients: updateIngredient(state, action),
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((value, index) => index !== state.editedIngredientIndex),
        editedIngredient: null,
        editedIngredientIndex: -1
      };
    case ShoppingListActions.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: {...state.ingredients[action.payload]}
      }
    case ShoppingListActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      }
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

function addIngredients(state: State, action: AddIngredients) {
  let newIngredients = [...state.ingredients];
  for (let i = 0; i < action.payload.length; i++) {
    newIngredients = saveOrUpdate({...action.payload[i]}, newIngredients);
  }
  return newIngredients;
}

function updateIngredient(state: State, action: UpdateIngredient) {
  const ingredient = state.ingredients[state.editedIngredientIndex];
  const updatedIngredient = {
    ...ingredient,
    ...action.payload
  }
  const updatedIngredients = [...state.ingredients];
  updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
  return updatedIngredients;
}

function getIndexOfIngredientByName(ingredients: Ingredient[], name: string) {
  const ingredient = ingredients.filter(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  return ingredient[0] ? ingredients.indexOf(ingredient[0]) : null;
}
