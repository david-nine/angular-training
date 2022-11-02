import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { throwError, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
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
        return throwError(error);
      }),
      finalize(() => this.isLoading = false)
    ).subscribe(responseData => {
      console.log(responseData);
    });
    form.reset();
  }
}
