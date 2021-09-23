import { Injectable } from '@angular/core';
import { ELEMENT_DATA } from './elements.component'
import { Observable, of } from 'rxjs';
import { PeriodicElement, PharmaticElement } from './elements.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(
    private http: HttpClient) { }

  private elementsUrl = 'api/elements';  // URL to web api
  getElements(): Observable<PeriodicElement[]> {
    return this.http.get<PeriodicElement[]>(this.elementsUrl);
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** PUT: update the element on the server */
  updateElements(element: PeriodicElement): Observable<any> {

    return this.http.put(this.elementsUrl, element, this.httpOptions).pipe(
      tap(() => {
          console.log(`updated table ${element.id}`);
        }),
      catchError(this.handleError<any>('updateTable'))
    );
  }

  updateSales(element: PharmaticElement): Observable<any> {

    return this.http.put(this.elementsUrl, element, this.httpOptions).pipe(
      tap(() => {
          console.log(`updated table ${element.id}`);
        }),
      catchError(this.handleError<any>('updateTable'))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
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
