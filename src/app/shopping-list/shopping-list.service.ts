import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private ingredients: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 8)
  ];

  constructor() { }

  public list():Ingredient[] {
    return this.ingredients;
  }

  public save(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
  }
}
