import {Actions, createEffect, ofType} from "@ngrx/effects";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {Action} from "@ngrx/store";

import * as AuthActions from './auth.acions';
import {environment} from "../../../environments/environment";
import {EXTERNAL_URL} from "../../config/url-interceptor.service";
import {Router} from "@angular/router";
import {User} from "../../../../user.model";
import {AuthService} from "../auth.service";

const USER_DATA_LOCAL_KEY = 'userData';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem(USER_DATA_LOCAL_KEY, JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate
  })
}

@Injectable()
export class AuthEffects {

  authLogin = createEffect(() => this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: any) => {
      return this.signin(authData)
    })
  ));

  authRedirect = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTHENTICATE_SUCCESS),
      tap(() => {
        this.router.navigate(['/']);
      }))
  }, {dispatch: false})

  authSignup = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.SIGNUP_START),
      tap(() => {
        this.authService.clearLogoutTimer();
      }),
      switchMap(authData => {
        return this.signup(authData);
      })
    )
  })

  authLogout = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.LOGOUT),
      tap(() => {
        localStorage.removeItem(USER_DATA_LOCAL_KEY);
        this.router.navigate(['/auth'])
      })
    )
  }, {
    dispatch: false
  });

  autoLogin = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.AUTO_LOGIN),
      map(() => {
        let userData = localStorage.getItem(USER_DATA_LOCAL_KEY);
        if (!userData) {
          return {type: 'DUMMY'} as Action;
        }

        const parsedUserData: {
          email: string;
          id: string;
          _token: string;
          _tokenExpirationDate: string;
        } = JSON.parse(userData);

        let tokenExpirationDate = new Date(parsedUserData._tokenExpirationDate);
        const loadedUser = new User(parsedUserData.email, parsedUserData.id, parsedUserData._token, tokenExpirationDate);
        if (loadedUser.token) {
          this.authService.setLogoutTimer(new Date().getTime() - tokenExpirationDate.getTime());
          return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: tokenExpirationDate
          });
        } else {
          return {type: 'DUMMY'} as Action;
        }
      })
    )
  })

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
  }

  private signin(authData: AuthActions.LoginStart): Observable<Action> {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      },
      {
        headers: new HttpHeaders().set(EXTERNAL_URL, "true")
      }).pipe(
      tap(resData => {
        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
      }),
      map((resData: AuthResponseData) => {
        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
      }),
      catchError((err: HttpErrorResponse) => {
        return this.handleError(err);
      })
    )
  }

  signup(authData: AuthActions.SignupStart): Observable<Action> {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
      {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      },
      {
        headers: new HttpHeaders().set(EXTERNAL_URL, "true")
      }).pipe(
      tap(resData => {
        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
      }),
      map(resData => {
        return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
      }),
      catchError(err => {
        return this.handleError(err);
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
    return of(new AuthActions.AuthenticateFail(errorMessage));
  }
}
