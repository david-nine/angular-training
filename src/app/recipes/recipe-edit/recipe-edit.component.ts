import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {map, takeUntil} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Subject} from "rxjs";

import {Recipe, RecipeForm} from "../recipe.model";
import {IngredientForm} from "../../shared/ingredient.model";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from '../store/recipe.action';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {

  id: number | any;
  editMode: boolean = false;
  formGroup: FormGroup<RecipeForm>;
  subscription: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.getFormGroup();
    this.route.params.pipe(
      takeUntil(this.subscription),
      map(params => params['id']),
    ).subscribe(recipeId => {
      this.id = +recipeId;
      this.editMode = !!recipeId;
      if (this.editMode) {
        this.getRecipe();
      }
    })
  }

  private getRecipe() {
    this.store.select('recipe').pipe(
      takeUntil(this.subscription),
      map(recipeState => {
        return recipeState.recipes.find(recipe => recipe.id === this.id);
      })
    ).subscribe(recipe => {
      if (recipe) {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      this.store.dispatch(new RecipesActions.EditRecipe({id: this.id, newRecipe: this.formGroup.value as Recipe}));
    } else {
      this.store.dispatch(new RecipesActions.AddRecipe(this.formGroup.value as Recipe));
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
