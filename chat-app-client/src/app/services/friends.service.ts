import { Injectable, OnDestroy, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private api = inject(ApiService)

  public $friendList = new Subject<any> ();

  constructor() { 
  }
  
  fetchFriendList(friendIds: string[]) {
    for (const friendId of friendIds) {
      this.api.get('users/' + friendId, []).subscribe({
        next: (res) => {
          this.$friendList.next(res);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
  
}
