import {Component, OnDestroy, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {Store} from "@ngrx/store";

import {Ingredient} from 'src/app/shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';
import * as ShoppingListActions from "../store/shopping-list.actions";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  formGroup: UntypedFormGroup;
  editMode = false;
  editIndex: number;
  subscription: Subscription;

  constructor(
    private shoppingListService: ShoppingListService,
    private formBuilder: UntypedFormBuilder,
    private store: Store<{shoppingList: { ingredients: Ingredient[]}}>
  ) {
    this.formGroup = this.getFormGroup();
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.onEditIngredient.subscribe(index => {
      this.editIndex = index;
      this.formGroup.patchValue(this.shoppingListService.getIngredient(index));
      this.editMode = true;
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
      this.shoppingListService.update(this.editIndex, value.name, value.amount)
      this.editMode = false;
    }
    else {
      const newIngredient = new Ingredient(value.name, value.amount);
      //this.shoppingListService.save(newIngredient);
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }
    this.formGroup.reset();
  }

  onClear() {
    this.editMode = false;
    this.formGroup.reset();
  }

  onDelete() {
    this.onClear();
    this.shoppingListService.delete(this.editIndex);
  }
}
