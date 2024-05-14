import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FriendsService } from '../../services/friends.service';
import { FriendMiniProfileComponent } from '../friend-mini-profile/friend-mini-profile.component';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-friends-col',
  standalone: true,
  imports: [FriendMiniProfileComponent, FontAwesomeModule, FormsModule],
  templateUrl: './sub-friends-col.component.html',
  styleUrl: './sub-friends-col.component.css'
})
export class SubFriendsColComponent implements OnInit, OnDestroy {
  private userService = inject(UserService);
  private friendListService = inject(FriendsService);

  currentFriendList: any;

  searchIcon = faMagnifyingGlass;
  cancelIcon = faXmark;

  searchValue: string;

  state: 0 | 1; // 0 - friends, 1 - search

  subscriptions: Subscription[] = [];

  constructor() {
    this.state = 0;
    this.currentFriendList = [];
    this.searchValue = "";
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.userService.newFriendSignal$.subscribe({
        next: (res) => {
          if (this.state == 0) {
            this.showFriends();
          }
        }
      }),
      this.friendListService.friendList$.subscribe({
        next: (res) => {
          this.currentFriendList.push(res);
        }
      })
    );
    this.showFriends();
  }

  searchUser() {
    this.state = 1;
    this.currentFriendList = [];
    this.userService.getUsers(this.searchValue).subscribe({
      next: (res) => {
        for (let user of res) {
          this.currentFriendList.push(user);
        }
      }
    });
  }

  showFriends() {
    this.state = 0;
    this.searchValue = "";
    this.currentFriendList = [];
    this.friendListService.fetchFriendList(this.userService.getUser().friends);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
