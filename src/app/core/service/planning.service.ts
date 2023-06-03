import { BehaviorSubject, catchError, first, interval, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  // private ip="http://192.168.2.222:8000/api";
  public connected$ = new BehaviorSubject<boolean>(false);
  private config = 'http://192.168.2.222:8000/api/connected';
  public connState: boolean;
  private source = interval(3000);

  constructor(private httpClient: HttpClient) {
    // this.source.subscribe(() => {
    //   this.httpClient.get(this.config, { observe: 'response' })
    //     .pipe(first())
    //     .subscribe(resp => {
    //       if (resp.status === 200) {
    //         this.connected(true);
    //       } else {
    //         this.connected(false);
    //       }
    //     }), err => this.connected(false);
    // });

    // this.connected$.subscribe(connected => {
    //   console.log("Connected: ", connected);
    // });
  }

  connected(data: boolean) {
    this.connState = data;
    this.connected$.next(this.connState);
  }

  public getPlanning(serverIp: string, dateStart: Date, dateEnd: Date) {
    console.log('from service   ' + serverIp);
    return this.httpClient .post<any[]>('http://' + serverIp + '/api/planning', { dateStart, dateEnd }) .pipe(catchError(this.handleError));
  }



  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }
}
