import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";

import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "./shopping-list.service";

@Injectable({ providedIn: 'root' })
export class ShoppingListResolverService implements Resolve<Ingredient[]> {

    constructor(
        private dataStorageService: DataStorageService,
        private shoppingListService: ShoppingListService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Ingredient[] | Observable<Ingredient[]> | Promise<Ingredient[]> {
        const ingredients = this.shoppingListService.list();
        if (ingredients.length === 0) {
            return this.dataStorageService.fetchShoppingList();
        }
        return ingredients;
    }

}