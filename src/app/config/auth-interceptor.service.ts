import {HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from '../auth/auth.service';

export const EXTERNAL_URL = "external";

@Injectable({providedIn: "root"})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let clonedReq = req;
    if (req.headers.get(EXTERNAL_URL)) {
      clonedReq = req.clone({
        headers: req.headers.delete(EXTERNAL_URL)
      })
    } else {
      const token = this.authService.user.value && this.authService.user.value.token;
      if (token) {
        clonedReq = req.clone({
          params: req.params ? req.params.append("auth", token) : new HttpParams().set('auth', token)
        });
      }
    }
    return next.handle(clonedReq);
  }
}
