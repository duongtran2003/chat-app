import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private api = inject(ApiService);
  private userService = inject(UserService);
  public conversationList: any = [];

  public conversationList$ = new Subject<any>();
  public clearSignal$ = new Subject<any>();
  public newMessageSignal$ = new Subject<any>();
  public messageList$ = new Subject<any>();
  public newConversationSignal$ = new Subject<any>();
  public hasNewMessageSignal$ = new Subject<any>();
  public messageSeenSignal$ = new Subject<any>();
  public conversationCheckedSignal$ = new Subject<any>();
  public lastMessageSignal$ = new Subject<any>();


  fetchAllConversations() {
    this.clearSignal$.next("");
    this.conversationList = [];
    this.api.get('conversations', []).subscribe({
      next: (res) => {
        let hasNew = false;
        for (let conversation of res) {
          this.conversationList.push(conversation);
          this.conversationList$.next(conversation);
          if (conversation.hasNew) {
            if (conversation.lastMessageOwner != this.userService.getUser()._id) {
              hasNew = true;
            }
          }
        }
        this.hasNewMessageSignal$.next(hasNew);
      }
    });
  }

  checkNewMessage() {
    this.api.get('conversations', []).subscribe({
      next: (res) => {
        let hasNew = false;
        for (let conversation of res) {
          if (conversation.hasNew) {
            if (conversation.lastMessageOwner != this.userService.getUser()._id) {
              hasNew = true;
            }
          }
        }
        this.hasNewMessageSignal$.next(hasNew);
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
        this.checkNewMessage();
        this.conversationCheckedSignal$.next(id);
      }
    })
  }

  fetchMessageById(id: string) {
    return this.api.get(`messages/${id}`, []);
  }
}
