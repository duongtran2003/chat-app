import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = inject(ApiService);


  public currentUser: any

  public newFriendSignal$ = new Subject<any>();

  constructor() {
    this.currentUser = {};
  }

  getUsers(name: string) {
    return this.api.get('users/', [["name", name]]);
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
    console.log("current user:", user);
  }

  getUser(): any {
    return this.currentUser;
  }

  isFriend(id: string) {
    return this.currentUser.friends.includes(id);
  }

  addNewFriend(id: string) {
    this.newFriendSignal$.next("");
    for (let friend of this.currentUser.friends) {
      if (friend == id) {
        return;
      }
    }
    this.currentUser.friends.push(id);
  }
}
