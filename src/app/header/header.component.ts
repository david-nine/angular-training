import {Component, EventEmitter, Output, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";

import {AuthService} from "../auth/auth.service";
import {DataStorageService} from "../shared/data-storage.service";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.acions';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  collapsed = true;
  @Output() featureSelected = new EventEmitter<string>();

  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe(user => {
        this.isAuthenticated = !!user;
      });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSaveData() {
    this.dataStorageService.storeData();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
    this.dataStorageService.fetchShoppingList().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
