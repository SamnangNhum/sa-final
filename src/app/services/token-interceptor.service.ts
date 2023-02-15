import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let access_token = this.addTokenHeader(req, localStorage.getItem('token'));

    return next.handle(access_token).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {

          return this.handleRefreshToken(req, next);
        }
        return of(err);
      })
    );
  }
  handleRefreshToken(req: HttpRequest<any>, next: HttpHandler) {
    let authService = this.injector.get(AuthService);

    return authService.generateRefreshToken().pipe(
      switchMap((data: any) => {
        authService.saveToken(data);
        return next.handle(this.addTokenHeader(req, data.access_token));
      }),

      catchError((err) => {
        authService.logout()

        return of(err);
      })
    );
  }
  addTokenHeader(request: HttpRequest<any>, token: any) {
    return request.clone({
      url: 'https://bc76-167-179-38-86.ap.ngrok.io' + request.url,
      setHeaders: {
        'ngrok-skip-browser-warning': 'any',
        Authorization: 'bearer ' + token,
      },
    });
  }
}
