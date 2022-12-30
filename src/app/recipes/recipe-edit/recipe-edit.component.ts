import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RecipeService} from '../recipe.service';
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number | any;
  editMode: boolean = false;
  formGroup: FormGroup<RecipeForm>;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.getFormGroup();
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.editMode = this.id != null;
      if (this.editMode) {
        let recipe = this.recipeService.get(this.id);
        this.formGroup.patchValue(recipe);
        if (recipe.ingredients) {
          for (let ingredient of recipe.ingredients) {
            let ingredientForm = this.createIngredientForm();
            ingredientForm.patchValue(ingredient);
            this.ingredientsForm.push(ingredientForm);
          }
        }
      }
    })
  }

  get ingredientsForm(): FormArray<FormGroup<IngredientForm>> {
    return this.formGroup.controls['ingredients'] as FormArray<FormGroup<IngredientForm>>;
  }

  getFormGroup() {
    return this.formBuilder.group({
      'id': [null],
      'name': [null, Validators.compose([Validators.required])],
      'imagePath': [null, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required])],
      'ingredients': this.formBuilder.array([])
    });
  }

  onAddIngredient() {
    this.ingredientsForm.push(this.createIngredientForm());
  }

  createIngredientForm(): FormGroup<IngredientForm> {
    const ingredientForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required, Validators.min(1)])]
    });

    ingredientForm.markAsPristine()

    return ingredientForm;
  }

  onSubmit() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    if (this.editMode) {
      this.recipeService.update(this.id, this.formGroup.value as Recipe);
    } else {
      this.recipeService.addRecipe(this.formGroup.value as Recipe);
    }

    this.onCancel()
  }

  onRemoveIngredient(index: number) {
    this.ingredientsForm.removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}

interface IngredientForm {
  name: FormControl<string>;
  amount: FormControl<number>;
}

interface RecipeForm {
  id: FormControl<number>;
  name: FormControl<string>;
  imagePath: FormControl<string>;
  description: FormControl<string>;
  ingredients: FormArray<FormGroup<IngredientForm>>;
}
