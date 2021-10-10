import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PeriodicElement, PharmaticElement } from "./elements.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";

@Injectable({
    providedIn: "root"
})
export class TableService {
    constructor(private http: HttpClient) {}

    private elementsUrl = "http://localhost:3000/api/posts"; // URL to web api

    getElements(): Observable<PeriodicElement[]> {
        return this.http.get<PeriodicElement[]>(this.elementsUrl);
    }

    httpOptions = {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
    };

    updateElements(element: PeriodicElement): Observable<any> {
      return this.http.put(this.elementsUrl, element, this.httpOptions).pipe(
          tap(() => {
              console.log(`updated table ${element.id}`);
          }),
          catchError(this.handleError<any>("updateTable"))
      );
    }

    saveElements(name: string, weight: string, amount: string, price: string) {
      // for (let i=0; i<element.length; i++) {
      //   postData.append("name", element[i].name);
      //   postData.append("weight", element[i].weight.toString());
      //   postData.append("amount", element[i].amount.toString());
      //   postData.append("price", element[i].price.toString());
      // }
      const postData = new FormData();
      postData.append("name", name);
      postData.append("weight", weight);
      postData.append("amount", amount);
      postData.append("price", price);
      this.http.post<{ message: string; post: PeriodicElement }>(
        "http://localhost:3000/api/posts",
        postData
      ).subscribe(() => console.log("saved"));
    }

    updateSales(element: PharmaticElement): Observable<any> {
        return this.http.put(this.elementsUrl, element, this.httpOptions).pipe(
            tap(() => {
                console.log(`updated table ${element.id}`);
            }),
            catchError(this.handleError<any>("updateTable"))
        );
    }
    private handleError<T>(operation = "operation", result?: T) {
        return (error: any): Observable<T> => {
            // TODO: send the error to remote logging infrastructure
            console.error(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            console.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
