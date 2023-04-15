import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {

  constructor(private httpClient: HttpClient) { }

  private ip="http://192.168.2.222:8000/api";

  public getPlanning(serverIp:string,dateStart:Date,dateEnd:Date){
    return this.httpClient.post<any[]>("http://"+serverIp +"/api/planning",{dateStart,dateEnd}).pipe(catchError(this.handleError))
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }
}
