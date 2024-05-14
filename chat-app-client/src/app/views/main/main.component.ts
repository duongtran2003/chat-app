import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { faUser, faAddressBook, faComment, faUserPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SubFriendsColComponent } from '../../components/sub-friends-col/sub-friends-col.component';
import { SubConversationsColComponent } from '../../components/sub-conversations-col/sub-conversations-col.component';
import { SubFriendRequestsColComponent } from '../../components/sub-friend-requests-col/sub-friend-requests-col.component';
import { MainColService } from '../../services/main-col.service';
import { ProfileMainComponent } from '../../components/profile-main/profile-main.component';
import { ConversationMainComponent } from '../../components/conversation-main/conversation-main.component';
import { FriendRequestService } from '../../services/friend-request.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    FontAwesomeModule,
    SubFriendsColComponent,
    SubConversationsColComponent,
    SubFriendRequestsColComponent,
    ProfileMainComponent,
    ConversationMainComponent,
    ToastrModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy, OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private mainTab = inject(MainColService);
  private friendRequestService = inject(FriendRequestService);
  private socket = inject(WebsocketService);
  private toastr = inject(ToastrService);

  navProfileIcon = faUser;
  navFriends = faAddressBook;
  navConversation = faComment;
  navFriendRequest = faUserPlus;
  navLogout = faSignOut;

  subscriptions: Subscription[] = [];

  user: any;
  currentTab: 0 | 1 | 2 | 3;
  currentSubColTab: 0 | 1 | 2 | 3;
  currentMainTab: 0 | 1 | 2;
  hasNewRequest: boolean;
  hasNewConversation: boolean;


  constructor() {
    this.hasNewConversation = false;
    this.hasNewRequest = false;
    this.user = {};
    this.currentTab = 0;
    this.currentSubColTab = 0;
    this.currentMainTab = 0;
    console.log('main constructed');
    this.socket.connect();
  }


  ngOnInit(): void {
    this.subscriptions.push(
      this.socket.listen('new-request').subscribe({
        next: (data) => {
          this.friendRequestService.fetchAllRequests();
        }
      }),
      this.socket.listen('accept-request').subscribe({
        next: (data: any) => {
          this.toastr.success(`${data.username} has accepted your friend request`, "You've got a new friend");
          this.userService.addNewFriend(data.userId);
        }
      }),
      this.friendRequestService.requestNum$.subscribe({
        next: (res) => {
          this.hasNewRequest = res
        }
      }),
      this.mainTab.currentMainTab$.subscribe({
        next: (tab) => {
          this.currentMainTab = tab;
        }
      }),
    );
    this.friendRequestService.fetchAllRequests();
    this.userService.fetchUser().subscribe({
      next: (user) => {
        this.user = user;
        this.userService.setUser(user);
        this.switchTab(0);
      },
      error: (err) => {
        const statusCode = err.status;
        if (statusCode == 500) {
          this.ngOnInit();
        }
        else {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  ngOnDestroy(): void {
    console.log("main destroyed");
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  logout() {
    this.socket.disconnect();
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  switchTab(tab: 0 | 1 | 2 | 3) {
    this.currentTab = tab;
    this.currentSubColTab = tab;
    if (tab == 0) {
      this.mainTab.switchTab(1, this.user._id);
    }
  }
}
