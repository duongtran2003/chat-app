import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { MainColService } from '../../services/main-col.service';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friend-mini-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friend-mini-profile.component.html',
  styleUrl: './friend-mini-profile.component.css'
})
export class FriendMiniProfileComponent implements OnInit, OnDestroy {
  @Input() user: any;
  private mainCol = inject(MainColService);
  private ws = inject(WebsocketService);
  private userService = inject(UserService);

  subscriptions: Subscription[] = [];
  isFriend: boolean = false;
  currentUser: any = {};

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.isFriend = this.userService.isFriend(this.user._id);
    this.subscriptions.push(
      this.ws.listen('user-connected').subscribe({
        next: (data: any) => {
          if (data.id == this.user._id) {
            this.user.isOnline = true;
          }
        }
      }),
      this.ws.listen('user-disconnected').subscribe({
        next: (data: any) => {
          if (data.id == this.user._id) {
            this.user.isOnline = false;
          }
        }
      }),
    )
  }

  showProfile() {
    this.mainCol.switchTab(1, this.user._id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
