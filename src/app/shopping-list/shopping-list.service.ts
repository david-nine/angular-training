import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Ingredient} from '../shared/ingredient.model';
import * as ShoppingListActions from "./store/shopping-list.actions";
import {Store} from "@ngrx/store";

@Injectable()
export class ShoppingListService {

  public ingredientsChanged: Subject<Ingredient[]> = new Subject();
  public onEditIngredient: Subject<number> = new Subject();

  private ingredients: Ingredient[] = [];

  constructor(
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {
  }

  public list(): Ingredient[] {
    return this.ingredients.slice();
  }

  public save(ingredient: Ingredient) {
    let ingredientHasSameName = this.getIngredientByName(ingredient.name);
    if (ingredientHasSameName != null) {
      ingredientHasSameName.amount += Number(ingredient.amount);
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  private getIngredientByName(name: string) {
    const ingredient = this.ingredients.filter(i => i.name.toLocaleLowerCase() === name.toLocaleLowerCase());
    return ingredient.length != 0 ? ingredient[0] : null;
  }

  public getIngredient(index: number): Ingredient {
    return this.ingredients.slice()[index];
  }

  public saveAll(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
    //ingredients.forEach(
    // (ingredient: Ingredient) => this.save(ingredient)
    //
  }

  update(index: number, name: any, amount: any) {
    const ingredient = new Ingredient(amount, name);
    this.store.dispatch(new ShoppingListActions.UpdateIngredient({index: index, ingredient: ingredient}))
    // const ingredient = this.ingredients[index];
    // ingredient.amount = amount;
    // ingredient.name = name;
    // this.ingredientsChanged.next(this.ingredients.slice())
  }

  delete(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  fetch(ingredients: Ingredient[]): void {
    this.ingredients = ingredients;
    this.ingredientsChanged.next(this.ingredients.slice());
  }
}
