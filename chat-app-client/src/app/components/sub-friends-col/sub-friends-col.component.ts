import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-sub-friends-col',
  standalone: true,
  imports: [],
  templateUrl: './sub-friends-col.component.html',
  styleUrl: './sub-friends-col.component.css'
})
export class SubFriendsColComponent implements OnInit {
  private userService = inject(UserService);
  private friendListService = inject(FriendsService);

  currentUser: any;
  currentFriendList: any;

  constructor() {
    this.currentFriendList = [];
    this.currentUser = {};
  } 

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.currentFriendList = this.currentUser.friends;
  }
}
