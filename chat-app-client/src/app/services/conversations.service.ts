import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private api = inject(ApiService);

  public conversationList: any = [];

  public conversationList$ = new Subject<any>();
  public clearSignal$ = new Subject<any>();

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
}
