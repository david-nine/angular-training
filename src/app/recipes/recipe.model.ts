import {Ingredient, IngredientForm} from "../shared/ingredient.model";
import {FormArray, FormControl, FormGroup} from "@angular/forms";

export class Recipe {

  public id?: number;
  public name: string;
  public description: string;
  public imagePath: string;
  public ingredients: Ingredient[];

  constructor(id: number, name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}

export interface RecipeForm {
  id: FormControl<number>;
  name: FormControl<string>;
  imagePath: FormControl<string>;
  description: FormControl<string>;
  ingredients: FormArray<FormGroup<IngredientForm>>;
}
