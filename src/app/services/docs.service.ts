import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DocsService {
  searchDocs(value: string): Observable<any> {
    return this.http.get(`/document/search?=${value}`).pipe(
      catchError((err) => {
        console.log(err);
        return of(err);
      })
    );
  }



  filterByCategory(value: string): Observable<any> {
    return this.http.get(`/document/document-category?query=${value}`).pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }

  filterByType(value: string): Observable<any> {
    return this.http.get(`/document/document-type?query=${value}`).pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }

  filterBySource(value: string): Observable<any> {
    return this.http.get(`/document/source?query=${value}`).pipe(
      catchError((err) => {
        return of(err);
      })
    );
  }

  getAttachMent(id: string): Observable<HttpResponse<Blob>> {
    return this.http.get('/upload/' + id, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  downloadDoc(id:string){
    this.getAttachMent(id).subscribe((response) => {
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = '';
      if (contentDisposition) {
        fileName = contentDisposition.split(';')[1].split('=')[1];
      } else {
        const contentType = response.headers.get('Content-Type');
        console.log(contentType);
        switch (contentType) {
          case 'application/pdf':
            fileName = 'download-' + id + '.pdf';
            break;
          case 'image/jpeg' || 'image/jpg':
            fileName = 'download-' + id + '.jpg';
            break;
          case 'image/png':
            fileName = 'download-' + id + '.png';
            break;
          case 'image/png':
            fileName = 'download-' + id + '.png';
            break;
          case 'application/msword':
            fileName = 'download-' + id + '.doc';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            fileName = 'download-' + id + '.docx';
            break;
          case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            fileName = 'download-' + id + '.pptx';
            break;
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            fileName = 'download-' + id + '.xlsx';
            break;
          case 'application/vnd.ms-excel':
            fileName = 'download-' + id + '.xlsx';
            break;
          default:
            fileName = 'download';
            break;
        }
      }
      const blob = new Blob([response.body!], {
        type: 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      link.remove();
    });
  }

  uploadAttachment(payload: any): Observable<any> {
    return this.http.post('/upload', payload).pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }

 
  // List
  getAllDocs(): Observable<any> {
    return this.http.get('/document?take=0&skip=0').pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }
  getDocsById(id: string): Observable<any> {
    return this.http.get('/document/' + id).pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }
  getAllDocSource(): Observable<any> {
    return this.http.get('/source/list').pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }

  getAllDocType(): Observable<any> {
    return this.http.get('/document-type/list').pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }

  getAllDocCategory(): Observable<any> {
    return this.http.get('/document-category/list').pipe(
      catchError((err) => {
        console.log(err);
        return of();
      })
    );
  }

  constructor(private http: HttpClient) {}
}
