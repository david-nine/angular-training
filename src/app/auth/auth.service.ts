import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.acions';

@Injectable({providedIn: "root"})
export class AuthService {

  constructor(
    private store: Store<fromApp.AppState>
  ) {
  }

  private _tokenExpirationTimer: any;

  setLogoutTimer(expirationDuration: number) {
    this._tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this._tokenExpirationTimer) {
      clearTimeout(this._tokenExpirationTimer);
      this._tokenExpirationTimer = null;
    }
  }
}
