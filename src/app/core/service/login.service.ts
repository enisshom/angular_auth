import { DataToken, Property, Role } from '../models/data-token';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Buffer } from 'buffer';
const ACCESS_TOKEN: string = "token_access";
const REFRESH_TOKEN: string = "token_refresh";
const URL: string = "http://localhost:8083/auth";


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<DataToken>;
  public currentUser: Observable<DataToken>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<DataToken>(new DataToken());
    if (this.getAccessToken() != null) {
      this.currentUserSubject = new BehaviorSubject<DataToken>(
        this.getData(this.getAccessToken())
      );
    }
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public currentUserValue(): DataToken {
    return this.currentUserSubject.value;
  }
  public permissions(): String[] {
    return this.currentUserSubject.value.permissions;
  }
  public properties(): any[] {
    return this.currentUserSubject.value.properties;
  }
  public roles(): any[] {
    return this.currentUserSubject.value.roles;
  }


  

  /*changePassword(token: string, changePassword:any): Observable<any>{
    return this.http.put<any>(`${URL}/api/v1/config/verify/change-password?token=${token}`, changePassword);
  }*/


  login(email: string, password: string) {
    return this.http.post<any>(`${URL}/login`, {email,password});
  }

  
  logout() {
    
    this.removeTokens()
    this.router.navigate(['/']);
    this.currentUserSubject.next(null);
    return of({ success: false });
  }


 
  saveToken(data: any): void{
    localStorage.setItem(ACCESS_TOKEN, data.access_token);
    localStorage.setItem(REFRESH_TOKEN, data.refresh_token);
  }


  getAccessToken(): string {
    return localStorage.getItem(ACCESS_TOKEN);
  }
  getRefreshToken(): string {
    return localStorage.getItem(REFRESH_TOKEN);
  }

  
  removeTokens(): void{
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    localStorage.removeItem("property")
  }


  getPayload(token: string): string{
    return token.split('.')[1];
  }

  //Get data(username, email, role, ...) from token.
  getData(token:any) : DataToken{
    const dataToken:DataToken = {
      email: null,
      userId: null,
      username: null,
      service: null,
      properties: [],
      propertyIds: [],
      permissions: [],
      roles: [],
      date_exp:null
    }
    //Get Payload from Token.
    const token1 =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpbzFAZ21haWwuY29tIiwiaWF0IjoxNjgxMzgzNDg4LCJleHAiOjE2ODEzODQwODh9.npUmxYi3oHACcLveWWVsrYY0GHapQYcR98nhuGLZb94';



    const payload = this.getPayload(token);
    console.log((payload))

    //Get data from Payload.
    
    
    //console.log(data);

    //Convert from data to DataToken(is a class).
    

const buffer = Buffer.from(payload, 'base64');
const data = JSON.parse(buffer.toString('utf-8'));
console.log(data); // Outputs: "Hello World"
    
    dataToken.email = data.sub;
    dataToken.date_exp = data.exp;
    
    // console.log("Properties "+dataToken.properties[0]);
    // console.log("Roles :"+dataToken.roles[0]);
    // console.log("Permissions "+dataToken.permissions.toString());

    // Get data from token.
    this.currentUserSubject.next(dataToken);

    return dataToken;
  }

 
  //Check experation date.
  checkDateExp(token: string): boolean{
    const data = this.getData(token)

    let date = new Date().getTime().toString();
    let date_exp_local = parseInt(date.substring(0, date.length -3));

    if(data.date_exp <= date_exp_local){
      return true;
    }
    return false
  }

  //Refresh TokenAccess
  async refreshToken(token: string): Promise<Object>{
    return await this.http.get(`${URL}/refresh-token`).toPromise();
  }


  async refrechAccessToken(){
    // Get Refresh Token.
    let token = this.getRefreshToken();
    // Remove Bearer from Refresh Token.
    token = token.replace('Bearer ', '');
    // Send Refresh Token to get new Access Token.
    await this.refreshToken(token).then(res => {
      console.log(res);
       //Save New Token.token_access
       this.saveToken(res);
       // Refrech Page to get new data.
       location.reload();
    });
  }
}
