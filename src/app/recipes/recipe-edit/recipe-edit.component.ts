import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
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
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.formGroup = this.getFormGroup();
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
      'name': [null, Validators.compose([Validators.required])],
      'imagePath': [null, Validators.compose([])],
      'description': [null, Validators.compose([Validators.required])],
      'ingredients': this.formBuilder.array([])
    })
    return formGroup;
  }
  
  onAddIngredient() {
    this.ingredientsForm.push(this.createIngredientForm());
  }

  createIngredientForm(): FormGroup {
    return this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required, Validators.min(1)])]
    })
  }

  onSave() {
    this.formGroup.markAllAsTouched();
  }
}
