import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
    collapsed = true;
    @Output() featureSelected = new EventEmitter<string>();

    constructor(
        private dataStorageService: DataStorageService
    ) { }
    
    ngOnInit(): void {
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

}