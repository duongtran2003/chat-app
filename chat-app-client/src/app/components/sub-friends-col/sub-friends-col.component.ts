import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FriendsService } from '../../services/friends.service';
import { FriendMiniProfileComponent } from '../friend-mini-profile/friend-mini-profile.component';

@Component({
  selector: 'app-sub-friends-col',
  standalone: true,
  imports: [FriendMiniProfileComponent],
  templateUrl: './sub-friends-col.component.html',
  styleUrl: './sub-friends-col.component.css'
})
export class SubFriendsColComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private friendListService = inject(FriendsService);

  currentFriendList: any;


  constructor() {
    this.currentFriendList = [];
  } 

  ngOnInit(): void {
    this.friendListService.friendList$.subscribe({
      next: (res) => {
        this.currentFriendList.push(res);
      }
    });
    this.friendListService.fetchFriendList(this.userService.getUser().friends);
  }
  ngOnDestroy(): void {
    console.log("destroyed");
  }
}
