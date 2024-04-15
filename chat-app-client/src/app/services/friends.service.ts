import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private api = inject(ApiService)

  public friendList: any; 

  constructor() { 
    this.friendList = []; 
  }
  
  addToFriendList(user: any) {
    this.friendList.push(user);
  }
  
  getFriendList() {
    return this.friendList;
  }
  
  isFriend(userId: string) {
    for (let friend of this.friendList) {
      if (friend._id == userId) {
        return true;
      }
    }
    return false;
  }
}
