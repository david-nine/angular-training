import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable()
export class ShoppingListService {

  public ingredientAdded: Subject<Ingredient[]> = new Subject();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 8)
  ];

  constructor() { }

  public list():Ingredient[] {
    return this.ingredients.slice();
  }

  public save(ingredient: Ingredient) {
    let ingredientHasSameName: Ingredient[] = this.ingredients.filter(i => i.name.toLocaleLowerCase() === ingredient.name.toLocaleLowerCase());
    if (ingredientHasSameName.length != 0) {
      ingredientHasSameName[0].amount += Number(ingredient.amount);
    } else {
      this.ingredients.push(ingredient);
    }
    this.ingredientAdded.next(this.ingredients.slice());
  }

  public saveAll(ingredients: Ingredient[]) {
    ingredients.forEach(
      (ingredient: Ingredient) => this.save(ingredient)
    )
  }
}
