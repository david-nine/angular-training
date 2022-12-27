import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";

import {EXTERNAL_URL} from "src/app/config/url-interceptor.service";
import {environment} from "src/environments/environment";
import {User} from "user.model";
import {Router} from "@angular/router";

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

  user = new BehaviorSubject<User | null>(null);
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

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
    this.user.next(user);
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

    const loadedUser = new User(parsedUserData.email, parsedUserData.id, parsedUserData._token, new Date(parsedUserData._tokenExpirationDate));
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(parsedUserData._tokenExpirationDate).getTime() - new Date().getTime();
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
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem(this.USER_DATA_LOCAL_KEY);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }
}
