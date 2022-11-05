import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

import { EXTERNAL_URL } from "src/app/config/url-interceptor.service";
import { environment } from "src/environments/environment";
import { User } from "user.model";

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {

    user = new BehaviorSubject<User | null>(null);

    constructor(
        private http: HttpClient
    ) { }

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
                tap(responseData => this.handleAutentication(
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
                tap(responseData => this.handleAutentication(
                    responseData.email,
                    responseData.localId,
                    responseData.idToken,
                    +responseData.expiresIn
                ))
            );
    }

    private handleAutentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email,
            userId,
            token,
            expirationDate
        );
        this.user.next(user);
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
}