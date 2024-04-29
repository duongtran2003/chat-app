import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);
  
  
  public currentUser: any

  constructor() { 
    this.currentUser = {};
  }

  updateUser(payload: any): Observable<any> {
    return this.api.post('users/', payload);
  }

  fetchUser(): Observable<any> {
    return this.api.get('auth/retrieve', []);
  }
  
  getUserInfo(id: string): Observable<any> {
    return this.api.get('users/' + id, []);
  } 

  newUser(user: { "username": string, "email": string, "password": string }): Observable<any> {
    return this.api.post('auth/register', user);
  }

  login(credentials: { "username": string, "password": string }): Observable<any> {
    return this.api.post('auth/login', credentials);
  }
  
  logout(): Observable<any> {
    return this.api.get('auth/logout', []);
  }
  
  setUser(user: any) {
    this.currentUser = user;
  }
  
  getUser(): any {
    return this.currentUser;
  }
}
