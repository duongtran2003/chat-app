import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }
  private api = inject(HttpClient);
  get(url: String, params: Array<[String, String]>): Observable<any> {
    let _url = environment.apiUrl + url;
    let query: String = "";
    for (let pair of params) {
      query += pair[0] + "=" + pair[1] + "&";
    }
    if (query.length > 0) {
      query = "?" + query;
      query = query.substring(0, query.length - 1);
      _url += query;
    }
    return this.api.get(_url, {
      withCredentials: true,
    });
  }

  post(url: String, payload: any): Observable<any> {
    let _url = environment.apiUrl + url;
    return this.api.post(_url, payload, {
      withCredentials: true,
    });
  }

  delete(url: String, params: Array<[String, String]>): Observable<any> {
    let _url = environment.apiUrl + url;
    let query: String = "";
    for (let pair of params) {
      query += pair[0] + "=" + pair[1] + "&";
    }
    if (query.length > 0) {
      query = "?" + query;
      query = query.substring(0, query.length - 1);
      _url += query;
    }
    return this.api.delete(_url, {
      withCredentials: true,
    });
  }
}
