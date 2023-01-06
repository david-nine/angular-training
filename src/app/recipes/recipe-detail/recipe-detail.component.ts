import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from "@ngrx/store";
import {map, switchMap} from "rxjs/operators";

import {Recipe} from '../recipe.model';
import * as ShoppingListActions from "../../shopping-list/store/shopping-list.actions";
import * as fromApp from "../../store/app.reducer";
import * as RecipesActions from '../store/recipe.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | any;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => +params['recipe']),
      switchMap(recipeId => {
        this.id = recipeId;
        return this.store.select('recipe')
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe => recipe.id === this.id))
      })
    ).subscribe(recipe => {
      this.recipe = recipe;
    })
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDeleteRecipe() {
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
