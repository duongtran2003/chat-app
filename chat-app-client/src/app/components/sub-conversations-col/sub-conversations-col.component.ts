import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { ConversationComponent } from '../conversation/conversation.component';
import { Subscription } from 'rxjs';
import { MainColService } from '../../services/main-col.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-sub-conversations-col',
  standalone: true,
  imports: [ConversationComponent],
  templateUrl: './sub-conversations-col.component.html',
  styleUrl: './sub-conversations-col.component.css'
})
export class SubConversationsColComponent implements OnInit, OnDestroy {

  private conversationService = inject(ConversationsService);
  private mainCol = inject(MainColService);
  private ws = inject(WebsocketService);
  conversationList: any = [];
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.conversationService.clearSignal$.subscribe({
        next: () => {
          this.conversationList = [];
        }
      }),
      this.conversationService.conversationList$.subscribe({
        next: (res) => {
          this.conversationList.push(res);
        }
      }),
      this.conversationService.newConversationSignal$.subscribe({
        next: (res) => {
          this.fetchAllConversations();
        }
      }),
      this.ws.listen('new-message').subscribe({
        next: (data: any) => {
          let hasConversation = false;
          this.conversationService.checkNewMessage();
          for (let conversation of this.conversationList) {
            if (conversation._id == data.conversationId) {
              hasConversation = true;
              conversation.hasNew = true;
              conversation.lastMessage = data.content
            }
          }
          if (!hasConversation) {
            this.conversationService.fetchConversationById(data.conversationId).subscribe({
              next: (res) => {
                this.conversationList.push(res);
              }
            });
          }
        }
      }),
      this.conversationService.conversationCheckedSignal$.subscribe({
        next: (data: any) => {
          for (let conversation of this.conversationList) {
            if (conversation._id == data) {
              conversation.hasNew = false;
            }
          }
        }
      }),
      this.conversationService.lastMessageSignal$.subscribe({
        next: (data: any) => {
          for (let conversation of this.conversationList) {
            if (conversation._id == data.id) {
              conversation.lastMessage = data.content;
            }
          }
        }
      })
    );
    this.fetchAllConversations();
  }

  fetchAllConversations() {
    this.conversationService.fetchAllConversations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
