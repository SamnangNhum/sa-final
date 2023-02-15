import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpOverride: HttpClient;
  constructor(
    private http: HttpClient,
    private router: Router,
    private handler: HttpBackend
  ) {
    this.httpOverride = new HttpClient(handler);
  }

  registerUser(payload: {}): Observable<any> {
    return this.http
      .post<{ access_token: string }>('/auth/register', payload)
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  loginProcess(email: string, password: string): Observable<any> {
    return this.http
      .post<{ access_token: string }>('/auth/login', { email, password })
      .pipe(
        catchError((err) => {
          return of(err);
        })
      );
  }

  registerStudent(payload: {}): Observable<any> {
    return this.http.post('/student', payload).pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }

  updateStudentProfile(payload:{} , student_id:string): Observable<any> {
    console.log(student_id)
    return this.http.patch('/student/' , student_id , payload).pipe(catchError((err) => {
      return of(err);
    }))
  }

  isLoggedIn() {
    console.log(localStorage.getItem('token'));
    return localStorage.getItem('token') != null;
  }

  HasAccess() {
    var logginToken = localStorage.getItem('token') || '';
    var extractToken = logginToken.split('.')[1];
    var atobData = atob(extractToken);
    var finaldata = JSON.parse(atobData);
    return finaldata;
  }

  generateRefreshToken() {
    // let inputToken = {
    //   user_id: localStorage.getItem('user_id'),
    // };
    // console.log(localStorage.getItem('refreshToken'));
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'bearer ' + localStorage.getItem('refreshToken'),
      'ngrok-skip-browser-warning': 'any',
    });

    return this.httpOverride.get<{ access_token: string }>(
      'https://bc76-167-179-38-86.ap.ngrok.io/auth/refresh',
      { headers: headers }
    );
  }

  saveToken(tokenData: any) {
    localStorage.setItem('token', tokenData.access_token);
    localStorage.setItem('refreshToken', tokenData.refresh_token);
  }

  getUserId(): Observable<any> {
    var logginToken = localStorage.getItem('token') || '';
    try {
      const base64Url = logginToken.split('.')[1];
      // if (!base64Url || base64Url.length % 4 > 0) {
      //   throw new Error();
      // }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));
     
      return of(decodedToken);
    } catch (Error) {
      return of(Error);
    }
  }

  getUserRegisterToken(token: string) {
    var extractToken = token.split('.')[1];
    var atobData = atob(extractToken);
    var finaldata = JSON.parse(atobData);
    return finaldata;
  }

  uploadProfile(): Observable<any> {
    return this.http.post('/profile', {});
  }

  getCurrentUser(id:string): Observable<any> {

    return this.http.post('/user/me', { id:id });
  }
  logout() {
    this.http.post('auth/logout', { userId: localStorage.getItem('userId') });
    localStorage.clear();
    this.router.navigateByUrl('login');
  }
}
