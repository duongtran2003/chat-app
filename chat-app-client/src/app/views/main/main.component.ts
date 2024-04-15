import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { WebsocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { faUser, faAddressBook, faComment, faUserPlus, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, FontAwesomeModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy, OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private wsService = inject(WebsocketService);
  private socket: any;
  
  navProfileIcon = faUser;
  navFriends = faAddressBook;
  navConversation = faComment;
  navFriendRequest = faUserPlus;
  navLogout = faSignOut;

  user: any;
  currentTab: 0 | 1 | 2 | 3; 

  constructor() {
    this.user = {};
    this.currentTab = 0;
  }
  
  ngOnInit(): void {
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
  }

}
