import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, finalize, map, tap} from 'rxjs/operators';

export class Contact {
  constructor(
    public phone?: string,
    public street?: string,
    public city?: string,
    public state?: string,
    public zip?: string,
    public name?: string,
  ) {}

  static create(data: any): Contact {
    return new Contact(
      data.phone,
      data.street,
      data.city,
      data.state,
      data.zip,
      data.name,
    );
  }
}

export class Url {
  constructor(
    public id?: number,
    public url?: string,
    public status?: string,
    public contact?: Contact,
    public lookForFilter?: string[],
    public contentTypeFilter?: string[],
    public excludeFilter?: string[]
  ) {}

  static create(data: any): Url {
    return new Url(
      data.id,
      data.url,
      data.status,
      data.contact,
      data.lookForFilter,
      data.contentTypeFilter,
      data.excludeFilter,
    );
  }
}


@Injectable({
  providedIn: 'root'
})
export class UrlService {
  
  private headers = new HttpHeaders();
  private params = new HttpParams();

  constructor(private http: HttpClient) {
    this.headers.append('Content-Type', 'application/json');
  }

  startJob(url: Url): Observable<Url> {
    console.log('Sending from client: ', url);
    return this.http.post<Url>('http://localhost:8000/api/start/', url);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error, operation);
      return of(result as T);
    };
  }

  updateStatus(ids): Observable<any> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:8000/api/status/', {ids}, {headers});
  }

  getCrawledData(ids): Observable<any> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post<any>('http://localhost:8000/api/crawled-data/', {ids}, {headers});
  }
}
