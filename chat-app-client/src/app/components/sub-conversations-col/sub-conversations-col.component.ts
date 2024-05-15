import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { ConversationComponent } from '../conversation/conversation.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-conversations-col',
  standalone: true,
  imports: [ConversationComponent],
  templateUrl: './sub-conversations-col.component.html',
  styleUrl: './sub-conversations-col.component.css'
})
export class SubConversationsColComponent implements OnInit, OnDestroy {

  private conversationService = inject(ConversationsService);

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
