import { Injectable } from "@angular/core";
import { InMemoryDbService } from "angular-in-memory-web-api";
import { PeriodicElement } from "./elements.model";
import { ELEMENT_DATA } from "./elements.component";

@Injectable({
    providedIn: "root"
})
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        const elements: PeriodicElement[] = ELEMENT_DATA;
        return { elements };
    }

    // Overrides the genId method to ensure that a element always has an id.
    // If the ELEMENT_DATA array is empty,
    // the method below returns the initial number (11).
    // if the ELEMENT_DATA array is not empty, the method below returns the highest
    // element id + 1.
    genId(ELEMENT_DATA: PeriodicElement[]): number {
        return ELEMENT_DATA.length > 0
            ? Math.max(...ELEMENT_DATA.map((element) => element.id)) + 1
            : 11;
    }
}
