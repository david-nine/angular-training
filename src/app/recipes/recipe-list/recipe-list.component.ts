import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";

import {Recipe} from '../recipe.model';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Observable<Recipe[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.recipes = this.store.select('recipe').pipe(map(recipesState => recipesState.recipes));
  }

  onAddRecipe(): void {
    this.router.navigate([ 'new' ], { relativeTo: this.route })
  }
}
