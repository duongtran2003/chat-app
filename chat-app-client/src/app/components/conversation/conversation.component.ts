import { Component, OnInit, Input, OnDestroy, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MainColService } from '../../services/main-col.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit, OnDestroy {
  @Input() conversation: any;


  private userService = inject(UserService);
  private mainCol = inject(MainColService);
  private ws = inject(WebsocketService);

  subscriptions: Subscription[] = [];


  otherUser: any = {};
  currentUser: any = {};

  constructor() {

  }


  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    for (let userId of this.conversation.members) {
      if (userId != this.currentUser._id) {
        this.userService.getUserInfo(userId).subscribe({
          next: (res) => {
            this.otherUser = res;
          }
        })
      }
    }
    this.subscriptions.push(
      this.ws.listen('user-connected').subscribe({
        next: (data: any) => {
          if (data.id == this.otherUser._id) {
            this.otherUser.isOnline = true;
          }
        }
      }),
      this.ws.listen('user-disconnected').subscribe({
        next: (data: any) => {
          if (data.id == this.otherUser._id) {
            this.otherUser.isOnline = false;
          }
        }
      }),
    )
  }

  showChat() {
    this.mainCol.switchTab(2, this.conversation._id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
