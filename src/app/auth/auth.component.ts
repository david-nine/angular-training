import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, take} from 'rxjs/operators';
import {AuthResponseData, AuthService} from './auth.service';
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  @ViewChild(PlaceholderDirective)
  alertHost: PlaceholderDirective;

  ngOnInit(): void {
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;
    this.error = null;

    let observable: Observable<AuthResponseData>;

    if (this.isLoginMode) {
      observable = this.authService.signin(email, password);
    } else {
      observable = this.authService.signup(email, password);
    }
    observable.pipe(
      catchError(error => {
        this.error = error;
        this.onShowAlertError(error);
        this.isLoading = false;
        return throwError(error);
      })
    ).subscribe(responseData => {
      this.router.navigate(['/recipes'])
    });
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  onShowAlertError(error: string) {
    const alertCpmFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCpmFactory);
    componentRef.instance.message = error;
    componentRef.instance.close.pipe(
      take(1)
    ).subscribe(() => hostViewContainerRef.clear());
  }
}
