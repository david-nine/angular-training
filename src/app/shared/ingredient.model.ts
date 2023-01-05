import {FormControl} from "@angular/forms";

export class Ingredient {
  constructor(public name: string, public amount: number) {
  }
}

export interface IngredientForm {
  name: FormControl<string>;
  amount: FormControl<number>;
}
