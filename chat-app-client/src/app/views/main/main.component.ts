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
    ConversationMainComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy, OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private wsService = inject(WebsocketService);
  private mainTab = inject(MainColService);
  private socket: any;

  navProfileIcon = faUser;
  navFriends = faAddressBook;
  navConversation = faComment;
  navFriendRequest = faUserPlus;
  navLogout = faSignOut;



  user: any;
  currentTab: 0 | 1 | 2 | 3;
  currentSubColTab: 0 | 1 | 2 | 3;
  currentMainTab: 0 | 1 | 2;

  constructor() {
    this.user = {};
    this.currentTab = 0;
    this.currentSubColTab = 0;
    this.currentMainTab = 0;
  }


  ngOnInit(): void {
    this.mainTab.currentMainTab$.subscribe({
      next: (tab) => {
        this.currentMainTab = tab;
      }
    });
    this.userService.fetchUser().subscribe({
      next: (user) => {
        this.user = user;
        this.userService.setUser(user);
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
  }

  logout() {
    this.wsService.disconnect();
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
