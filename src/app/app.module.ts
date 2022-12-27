import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RecipesComponent} from './recipes/recipes.component';
import {RecipeListComponent} from './recipes/recipe-list/recipe-list.component';
import {RecipeDetailComponent} from './recipes/recipe-detail/recipe-detail.component';
import {RecipeItemComponent} from './recipes/recipe-list/recipe-item/recipe-item.component';
import {ShoppingListComponent} from './shopping-list/shopping-list.component';
import {ShoppingEditComponent} from './shopping-list/shopping-edit/shopping-edit.component';
import {DropdownDirective} from './shared/dropdown.directive';
import {ShoppingListService} from './shopping-list/shopping-list.service';
import {RecipeStartComponent} from './recipes/recipe-start/recipe-start.component';
import {RecipeEditComponent} from './recipes/recipe-edit/recipe-edit.component'
import {ControlErrorsComponent} from './shared/control-errors/control-errors.component';
import {RecipeService} from './recipes/recipe.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {URLInterceptorService} from './config/url-interceptor.service';
import {AuthComponent} from './auth/auth.component';
import {RouteNotFoundComponent} from './shared/route-not-found/route-not-found.component';
import {LoadingSpinerComponent} from './shared/loading-spiner/loading-spiner.component';
import {AuthInterceptorService} from './config/auth-interceptor.service';
import {AlertComponent} from "./shared/alert/alert.component";
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipeStartComponent,
    RecipeEditComponent,
    ControlErrorsComponent,
    AuthComponent,
    RouteNotFoundComponent,
    LoadingSpinerComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: URLInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    ShoppingListService,
    RecipeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
