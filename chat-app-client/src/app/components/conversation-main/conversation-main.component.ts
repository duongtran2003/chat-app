import { Component, OnInit, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { MainColService } from '../../services/main-col.service';

@Component({
  selector: 'app-conversation-main',
  standalone: true,
  imports: [],
  templateUrl: './conversation-main.component.html',
  styleUrl: './conversation-main.component.css'
})
export class ConversationMainComponent implements OnInit {

  private conversationService = inject(ConversationsService);
  private mainCol = inject(MainColService);

  conversation: any;

  ngOnInit(): void {
    this.mainCol.currentMainTabId$.subscribe({
      next: (res) => {
        this.conversationService.fetchConversationById(res).subscribe({
          next: (res) => {
            this.conversation = res;
          }
        })
      }
    });
    this.conversationService.fetchConversationById(this.mainCol.getCurrentTabId()).subscribe({
      next: (res) => {
        this.conversation = res;
        console.log(res);
      }
    })
  }
}
