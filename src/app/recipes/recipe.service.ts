import { Injectable, EventEmitter } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

  public recipeSelected: EventEmitter<Recipe> = new EventEmitter<Recipe>();

  private recipes:Recipe[] = [
    new Recipe(
      'A Test Recipe', 
      'This is a simply test', 
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574',
      [
        new Ingredient("Pieces of cheese", 30),
        new Ingredient("Liters of milk", 3)
      ]),    
      new Recipe(
        'A Another Test Recipe', 
        'This is a simply test', 
        'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574',
        [
          new Ingredient("Grams of Chocolate", 500),
          new Ingredient("Tomatoes", 15)
        ] 
      )
  ];

  constructor() { }

  public list(): Recipe[] {
    return this.recipes.slice();
  }

  public save(recipe: Recipe) {
    this.recipes.push(recipe);
  }

}
