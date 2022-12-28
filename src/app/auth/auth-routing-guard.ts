import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";
import {map, take} from "rxjs/operators";

@Injectable()
export class AuthRoutingGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        if (user) {
          return this.router.createUrlTree(['/recipes']);
        }
        return true;
      })
    );
  }
}
