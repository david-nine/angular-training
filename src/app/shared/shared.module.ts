import {NgModule} from '@angular/core';
import {ControlErrorsComponent} from "./control-errors/control-errors.component";
import {CommonModule} from "@angular/common";
import {DropdownDirective} from "./dropdown.directive";
import {RouteNotFoundComponent} from "./route-not-found/route-not-found.component";
import {PlaceholderDirective} from "./placeholder/placeholder.directive";
import {LoadingSpinnerComponent} from "./loading-spiner/loading-spinner.component";
import {AlertComponent} from "./alert/alert.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ControlErrorsComponent,
    DropdownDirective,
    RouteNotFoundComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    AlertComponent,
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  declarations: [
    ControlErrorsComponent,
    DropdownDirective,
    RouteNotFoundComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    AlertComponent
  ]
})
export class SharedModule {
}
