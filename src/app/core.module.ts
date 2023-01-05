import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {URLInterceptorService} from "./config/url-interceptor.service";
import {AuthInterceptorService} from "./config/auth-interceptor.service";
import {RecipeService} from "./recipes/recipe.service";

@NgModule({
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
    RecipeService
  ]
})
export class CoreModule {
}
