import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Store} from "@ngrx/store";

import {Ingredient, IngredientForm} from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  formGroup: FormGroup<IngredientForm>;
  editMode = false;
  editIndex: number;
  subscription: Subscription;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private store: Store<fromApp.AppState>
  ) {
    this.formGroup = this.getFormGroup();
  }

  ngOnInit(): void {
    this.subscription = this.store.select('shoppingList').subscribe(state => {
      if (state.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editIndex = state.editedIngredientIndex;
        this.formGroup.patchValue(state.editedIngredient as Ingredient);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  getFormGroup() {
    return this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required, Validators.min(1)])]
    });
  }

  onSave() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return;
    }
    const value = this.formGroup.value;
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(value as Ingredient));
      this.editMode = false;
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(value as Ingredient));
    }
    this.formGroup.reset();
  }

  onClear() {
    this.editMode = false;
    this.formGroup.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
