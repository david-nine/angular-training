import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";

import * as fromApp from './store/app.reducer';
import * as AuthActions from './auth/store/auth.acions';
import {NavigationStart, Router} from "@angular/router";
import {AuthService} from "./auth/auth.service";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.authService.clearLogoutTimer();
    });
    this.store.dispatch(new AuthActions.AutoLogin());
  }

}
