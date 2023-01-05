import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {map, take} from "rxjs/operators";
import {Store} from "@ngrx/store";

import {AuthService} from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => authState.user),
      map(user => {
        if (!!user) {
          return true;
        }
        return this.router.createUrlTree(['/auth']);
      }));
  }
}
