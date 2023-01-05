import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {catchError, take} from 'rxjs/operators';
import {Store} from "@ngrx/store";

import {AuthResponseData, AuthService} from './auth.service';
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import * as AuthActions from './store/auth.acions';
import * as fromApp from '../store/app.reducer';

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
    this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.onShowAlertError();
      }
    })
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
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

    let observable: Observable<AuthResponseData> = of();

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email: email,
        password: password
      }))
    } else {
      observable = this.authService.signup(email, password);
    }
    observable.pipe(
      catchError(error => {
        this.error = error;
        this.onShowAlertError();
        this.isLoading = false;
        return throwError(error);
      })
    ).subscribe(responseData => {
      this.router.navigate(['/recipes'])
    });
    form.reset();
  }

  onShowAlertError() {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    componentRef.instance.message = this.error;
    componentRef.instance.close.pipe(
      take(1)
    ).subscribe(() => hostViewContainerRef.clear());
  }
}
