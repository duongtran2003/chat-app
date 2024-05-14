import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { MainColService } from '../../services/main-col.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-conversation-main',
  standalone: true,
  imports: [],
  templateUrl: './conversation-main.component.html',
  styleUrl: './conversation-main.component.css'
})
export class ConversationMainComponent implements OnInit, OnDestroy {

  private conversationService = inject(ConversationsService);
  private mainCol = inject(MainColService);

  conversation: any = {};

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.mainCol.currentMainTabId$.subscribe({
        next: (res) => {
          this.conversationService.fetchConversationById(res).subscribe({
            next: (res) => {
              this.conversation = res;
            }
          })
        }
      })
    );
    this.conversationService.fetchConversationById(this.mainCol.getCurrentTabId()).subscribe({
      next: (res) => {
        this.conversation = res;
        console.log(res);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
