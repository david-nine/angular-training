import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {Store} from "@ngrx/store";
import {Router} from "@angular/router";

import {EXTERNAL_URL} from "src/app/config/url-interceptor.service";
import {environment} from "src/environments/environment";
import {User} from "user.model";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.acions';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({providedIn: "root"})
export class AuthService {

  private readonly USER_DATA_LOCAL_KEY = 'userData';

  //
  // user = new BehaviorSubject<User | null>(null);
  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
  }

  private tokenExpirationTimer: any;

  signup(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {
        headers: new HttpHeaders().set(EXTERNAL_URL, "true")
      }).pipe(
      catchError(errorRes => this.handleError(errorRes)),
      tap(responseData => this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      ))
    );
  }

  signin(email: string, password: string): Observable<AuthResponseData> {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      },
      {
        headers: new HttpHeaders().set(EXTERNAL_URL, "true")
      }).pipe(
      catchError(errorRes => this.handleError(errorRes)),
      tap(responseData => this.handleAuthentication(
        responseData.email,
        responseData.localId,
        responseData.idToken,
        +responseData.expiresIn
      ))
    );
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(
      email,
      userId,
      token,
      expirationDate
    );
    this.store.dispatch(new AuthActions.Login({
      email: email,
      userId: userId,
      token: token,
      expirationDate: expirationDate
    }));
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem(this.USER_DATA_LOCAL_KEY, JSON.stringify(user))
  }

  autoLogin() {
    let userData = localStorage.getItem(this.USER_DATA_LOCAL_KEY);
    if (!userData) {
      return;
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
      this.store.dispatch(new AuthActions.Login({
        email: loadedUser.email,
        userId: loadedUser.id,
        token: loadedUser.token,
        expirationDate: tokenExpirationDate
      }))
      const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
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
    return throwError(errorMessage);
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    this.router.navigate(['/auth']);
    localStorage.removeItem(this.USER_DATA_LOCAL_KEY);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }
}
