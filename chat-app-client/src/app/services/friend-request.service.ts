import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendRequestService {

  private api = inject(ApiService);
  requestList: any[];
  public requestList$ = new Subject<any>();
  public clearSignal$ = new Subject<any>();

  constructor() {
    this.requestList = [];
  }

  addRequest(request: any) {
    this.requestList.push(request);
    this.requestList$.next(request);
  }

  fetchAllRequests() {
    this.requestList = [];
    this.clearSignal$.next("");
    this.api.get('friendRequests/', []).subscribe({
      next: (res) => {
        for (let request of res) {
          this.requestList.push(request);
          this.requestList$.next(request);
        }
      }
    });
  }

  checkRequest(id: string): Observable<any> {
    return this.api.get('friendRequests/', [['id', id]]);
  }

  sendFriendRequest(id: string): Observable<any> {
    return this.api.post('friendRequests/create', { recipient: id });
  }

  deleteFriendRequest(id: string): Observable<any> {
    return this.api.delete('friendRequests/', [['id', id]]);
  }

  acceptFriendRequest(id: string): Observable<any> {
    return this.api.post('friendRequests/handleRequest', { otherUserId: id, action: "accept" });
  }
  declineFriendRequest(id: string): Observable<any> {
    return this.api.post('friendRequests/handleRequest', { otherUserId: id, action: "decline" });
  }
}
