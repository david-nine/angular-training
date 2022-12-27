import {NgModule} from '@angular/core';
import {ControlErrorsComponent} from "./control-errors/control-errors.component";
import {CommonModule} from "@angular/common";
import {DropdownDirective} from "./dropdown.directive";
import {RouteNotFoundComponent} from "./route-not-found/route-not-found.component";
import {PlaceholderDirective} from "./placeholder/placeholder.directive";
import {LoadingSpinnerComponent} from "./loading-spiner/loading-spinner.component";
import {AlertComponent} from "./alert/alert.component";

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ControlErrorsComponent,
    DropdownDirective,
    RouteNotFoundComponent,
    PlaceholderDirective,
    LoadingSpinnerComponent,
    AlertComponent
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
