import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  applicationJson: string = 'application/json';
  constructor(private authenticationService: LoginService, private _router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
     return from(this.handle(request, next));
  }

  async handle(request: HttpRequest<any>, next: HttpHandler) {
     var token: string = this.authenticationService.getAccessToken();
     // add authorization header with jwt token if available
     if (token) {
        // Check experation date for TokenAccess.
        if (this.authenticationService.checkDateExp(token)) {
           // Get Refresh Token.
           token = this.authenticationService.getRefreshToken();
           // Remove Bearer from Refresh Token.
           token = token.replace('Bearer ', '');
           // remove user from local storage.
           this.authenticationService.removeTokens();
           // Send Refresh Token to get new Access Token.
           await this.authenticationService.refreshToken(token).then(res => {
              // Check experation date for Refresh Token.
              if (res == null) {
                 this.authenticationService.logout();
                 location.reload();
                 return;
              }
              //Save New Token.token_access
              this.authenticationService.saveToken(res);
              //Get Token from LocalStorage
              token = this.authenticationService.getAccessToken();
              request = request.clone({
                 headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    Authorization: token,
                    'Property-Id': localStorage.getItem('property') ? localStorage.getItem('property') : '0',
                 }),
              });
              return next.handle(request).toPromise();
           });
        }
       

        return next.handle(request).toPromise();
     }
     return next.handle(request).toPromise();
  }
}