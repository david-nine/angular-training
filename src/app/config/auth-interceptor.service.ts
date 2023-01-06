import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from "@ngrx/store";

import {AuthService} from '../auth/auth.service';
import {exhaustMap, map, take} from "rxjs/operators";
import * as fromApp from '../store/app.reducer';

export const EXTERNAL_URL = "external";

@Injectable({providedIn: "root"})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.headers.get(EXTERNAL_URL)) {
      const clonedReq = req.clone({
        headers: req.headers.delete(EXTERNAL_URL)
      })
      return next.handle(clonedReq);
    } else {
      return this.store.select('auth').pipe(
        take(1),
        map(authState => {
          return authState.user;
        }),
        exhaustMap(user => {
          if (!user) {
            return next.handle(req);
          }
          const modifiedReq = req.clone({
            params: new HttpParams().append('auth', user.token as string)
          });
          return next.handle(modifiedReq);
        })
      );
    }
  }
}
