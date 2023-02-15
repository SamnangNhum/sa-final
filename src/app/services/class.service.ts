import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor(private http:HttpClient) { }
  getAllClass(): Observable<any>{
    return this.http.get('/class/list').pipe(catchError((err)=>{
      return of(err);
    }))
  }

  getClassById(id:string): Observable<any>{
    return this.http.get('/class/' + id).pipe(catchError((err)=>{
      return of(err);
    }))
  }
}
