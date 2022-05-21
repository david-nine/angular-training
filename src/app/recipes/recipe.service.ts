import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe(
      1,
      'A Test Recipe',
      'This is a simply test',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574',
      [
        new Ingredient("Pieces of cheese", 30),
        new Ingredient("Liters of milk", 3)
      ]),
    new Recipe(
      2,
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

  public get(id: number): Recipe {
    return this.recipes.slice().find((recipe: Recipe) => recipe.id == id) as Recipe;
  }

}
