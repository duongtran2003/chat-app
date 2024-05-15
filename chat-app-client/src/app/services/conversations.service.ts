import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private api = inject(ApiService);

  public conversationList: any = [];

  public conversationList$ = new Subject<any>();
  public clearSignal$ = new Subject<any>();
  public newMessageSignal$ = new Subject<any>();
  public messageList$ = new Subject<any>();
  public newConversationSignal$ = new Subject<any>();


  fetchAllConversations() {
    this.clearSignal$.next("");
    this.conversationList = [];
    this.api.get('conversations', []).subscribe({
      next: (res) => {
        for (let conversation of res) {
          this.conversationList.push(conversation);
          this.conversationList$.next(conversation);
        }
      }
    });
  }

  fetchConversationByMember(id: string) {
    return this.api.get('conversations', [['id', id]]);
  }

  fetchConversationById(id: string) {
    return this.api.get(`conversations/${id}`, []);
  }

  createNewConversation(id: string) {
    return this.api.post('conversations', { recipient: id });
  }

  createNewMessage(payload: { conversationId: string, content: string }) {
    return this.api.post('messages', payload);
  }

  fetchAllMessages(id: string) {
    this.api.get('messages', [['convoId', id]]).subscribe({
      next: (res) => {
        for (let message of res) {
          this.messageList$.next(message);
        }
      }
    })
  }
}
