import { Component, OnInit, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { ConversationComponent } from '../conversation/conversation.component';

@Component({
  selector: 'app-sub-conversations-col',
  standalone: true,
  imports: [ConversationComponent],
  templateUrl: './sub-conversations-col.component.html',
  styleUrl: './sub-conversations-col.component.css'
})
export class SubConversationsColComponent implements OnInit {

  private conversationService = inject(ConversationsService);

  conversationList: any = [];

  ngOnInit(): void {
    this.conversationService.clearSignal$.subscribe({
      next: () => {
        this.conversationList = [];
      }
    })
    this.conversationService.conversationList$.subscribe({
      next: (res) => {
        this.conversationList.push(res);
      }
    });
    this.fetchAllConversations();
  }

  fetchAllConversations() {
    this.conversationService.fetchAllConversations();
  }
}
