import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Observable, of, throwError} from "rxjs";
import {Action, Store} from "@ngrx/store";

import * as AuthActions from './auth.acions';
import {environment} from "../../../environments/environment";
import {EXTERNAL_URL} from "../../config/url-interceptor.service";
import {Router} from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

  authLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: any) => {
      return this.login(authData)
    })
  ));

  authSuccess = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGIN),
      tap(() => {
        this.router.navigate(['/'])
      }))
  }, {dispatch: false})

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {
  }

  private login(authData: AuthActions.LoginStart): Observable<Action> {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      },
      {
        headers: new HttpHeaders().set(EXTERNAL_URL, "true")
      }).pipe(
      map((resData: AuthResponseData) => {
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        return new AuthActions.Login({
          email: resData.email,
          userId: resData.localId,
          token: resData.idToken,
          expirationDate: expirationDate
        })
      }),
      catchError((err: HttpErrorResponse) => {
        return of(new AuthActions.LoginFail(this.handleError(err)));
      })
    )
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An error occurred!';
    if (errorRes.error && errorRes.error.error) {
      switch (errorRes.error.error.message) {
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid password';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'Email not found';
          break;
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already';
          break;
        case 'INVALID_EMAIL':
          errorMessage = 'Invalid email';
      }
    }
    return errorMessage;
  }
}
