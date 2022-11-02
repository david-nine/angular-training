import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id: number | any;
  editMode: boolean = false;
  formGroup: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private recipeService: RecipeService,
    private router: Router
  ) { }

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

  get ingredientsForm(): FormArray {
    return this.formGroup.controls['ingredients'] as FormArray;
  }

  getFormGroup() {
    const formGroup = this.formBuilder.group({
      'id': [null],
      'name': [null, Validators.compose([Validators.required])],
      'imagePath': [null, Validators.compose([Validators.required])],
      'description': [null, Validators.compose([Validators.required])],
      'ingredients': this.formBuilder.array([])
    })
    return formGroup;
  }
  
  onAddIngredient() {
    this.ingredientsForm.push(this.createIngredientForm());
  }

  createIngredientForm(): FormGroup {
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
      this.recipeService.update(this.id, this.formGroup.value);
    } else {
      this.recipeService.addRecipe(this.formGroup.value);
    }

    this.onCancel()
  }

  onRemoveIngredient(index: number) {
    this.ingredientsForm.removeAt(index);
  }

  onCancel() {
    this.router.navigate([ '../' ], { relativeTo: this.route })
  }
}
