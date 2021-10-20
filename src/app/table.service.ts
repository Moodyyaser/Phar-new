import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { PeriodicElement, PharmaticElement } from "./elements.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({
    providedIn: "root"
})
export class TableService {
    constructor(private http: HttpClient, private router: Router) {}

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

    addPost(te: number, length: number, date: Date, name: string, companies: any, elements: any, table_array: any) {
      //Pack all created elements in an array
      var element_ename = [];
      var element_eweight = [];
      var element_eprice = [];
      for (let i = 0; i < elements.length; i += 1) {
        element_ename.push(elements[i].name);
        element_eweight.push(elements[i].weight);
        element_eprice.push(elements[i].price);
      }

      //Pack all table elements in an array
      var element_name = [];
      var element_weight = [];
      var element_amount = [];
      var element_price = [];
      for (let i = 0; i < table_array.length; i += 1) {
        element_name  .push(table_array[i].name);
        element_weight.push(table_array[i].weight);
        element_amount.push(table_array[i].amount);
        element_price .push(table_array[i].price);
      }

      let postData = {
        te: te,
        length: length,
        date: date,
        name: name,
        companies: companies,
        element_ename:   element_ename,
        element_eweight: element_eweight,
        element_eprice:  element_eprice,
        element_name  : element_name,
        element_weight: element_weight,
        element_amount: element_amount,
        element_price : element_price,
      };

      this.http.post<{ message: string; }>(
        "http://localhost:3000/api/posts",
        postData
      ).subscribe(() => console.log("Uploaded successfully"));
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
    deletePost(postId: string){
      console.log("deletePost");
      return this.http.delete("http://localhost:3000/api/posts/" + postId);
    }
}
