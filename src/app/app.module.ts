import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {CoreModule} from "./core.module";
import {SharedModule} from "./shared/shared.module";
import {StoreModule} from "@ngrx/store";
import * as fromApp from './store/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    StoreModule.forRoot(fromApp.appReducer),
    AppRoutingModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
