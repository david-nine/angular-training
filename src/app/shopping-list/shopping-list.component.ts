import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: []
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  
  ingredients: Ingredient[] = []
  private igChangeSub: Subscription = new Subscription();

  constructor(
    private shoppingListService: ShoppingListService
  ) { }

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.list();
    this.igChangeSub = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[]) => this.ingredients = ingredients
    );
  }

  ngOnDestroy(): void {
    this.igChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
    this.shoppingListService.onEditIngredient.next(index);
  }
}