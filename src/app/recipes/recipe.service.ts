import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Recipe } from './recipe.model';

@Injectable()
export class RecipeService {

  private recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

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

  public addRecipe(recipe: Recipe) {
    const id = this.getLastId();
    recipe.id = id + 1;
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  public update(id: number, newRecipe: Recipe) {
    const indexToRecipe = this.recipes.findIndex((recipe: Recipe) => recipe.id == id);
    this.recipes[indexToRecipe] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  public delete(id: number) {
    this.recipes.splice(this.recipes.findIndex((recipe: Recipe) => recipe.id == id), 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  public get recipesChangedObservable(): Observable<Recipe[]> {
    return this.recipesChanged.asObservable();
  }

  private getLastId(): number {
    let id = 0;
    for (let recipe of this.recipes) {
      if (recipe.id > id) {
        id = recipe.id;
      }
    }
    return id;
  }

  fetch(recipes: Recipe[]): void {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
