import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

  private recipes:Recipe[] = [
    new Recipe('A Test Recipe', 'This is a simply test', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574'),
    new Recipe('A Another Test Recipe', 'This is a simply test', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&resize=768,574')
  ];

  constructor() { }

  public listRecipes(): Recipe[] {
    return this.recipes;
  }

  public saveRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
  }

}
