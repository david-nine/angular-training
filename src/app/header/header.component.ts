import { Component, EventEmitter, Output, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { DataStorageService } from "../shared/data-storage.service";
import { Subscription } from "rxjs";

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
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.isAuthenticated = !!this.authService.user.getValue();
        this.userSub = this.authService.user.subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    ngOnDestroy(): void {
        this.userSub.unsubscribe();
    }

    onSelect(feature: string) {
        this.featureSelected.emit(feature);
    }

    onSaveData() {
        this.dataStorageService.storeData();
    }

    onFetchData() {
        this.dataStorageService.fetchRecipes().subscribe();
        this.dataStorageService.fetchShoppingList().subscribe();
    }

  onLogout() {
    this.authService.logout();
  }
}
