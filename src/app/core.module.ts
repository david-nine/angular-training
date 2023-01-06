import {NgModule} from '@angular/core';
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {URLInterceptorService} from "./config/url-interceptor.service";
import {AuthInterceptorService} from "./config/auth-interceptor.service";

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
    }
  ]
})
export class CoreModule {
}
