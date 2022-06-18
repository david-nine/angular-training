import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  formGroup: FormGroup;
  
  constructor(
    private shoppingListService: ShoppingListService,
    private formBuilder: FormBuilder
  ) {
    this.formGroup = this.getFormGroup();
  }

  ngOnInit(): void {
  }

  getFormGroup() {
    const formGroup = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])]
    })
    return formGroup;
  }

  onSave() {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched()
      return;
    }
    const value = this.formGroup.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    this.shoppingListService.save(newIngredient);
  }

}