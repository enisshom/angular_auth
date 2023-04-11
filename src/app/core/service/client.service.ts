import { catchError, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Client } from '../models/client.model';
@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private httpClient: HttpClient) { }

  private url="http://192.168.2.222:8000/api";
  public getAllClients(){
    return this.httpClient.get<any[]>(this.url +"/planning")
  }
  public getPlanning(dateStart:Date,dateEnd:Date){
    return this.httpClient.post<any[]>(this.url +"/planning",{dateStart,dateEnd}).pipe(catchError(this.handleError))
  }
  public createClient(client) {
    return this.httpClient.post<Client>(this.url ,client);
  }

  getById(id: number) {
    return this.httpClient.get<Client>(this.url+"/"+id);
  }

  update(client) {
   return this.httpClient.put<Client>(
    this.url+"/"+client.id,
    client
   );
  }
  delete(client){
    return this.httpClient.delete<Client>(
      this.url+"/delete?id="+client.id
     );
  }
  private handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => err);
  }
}
