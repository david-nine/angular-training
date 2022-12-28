import {NgModule} from '@angular/core';

import {AuthComponent} from './auth.component';
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {AuthRoutingGuard} from "./auth-routing-guard";

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{
      path: '',
      component: AuthComponent,
      canActivate: [AuthRoutingGuard]
    }])
  ],
  exports: [
    AuthComponent,
    RouterModule
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    AuthRoutingGuard
  ]
})
export class AuthModule {
}
