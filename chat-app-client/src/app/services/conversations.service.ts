import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  private api = inject(ApiService);

  public conversationList: any;

  constructor() { 
    this.conversationList = []; 
  }
  
  addToConversationList(conversation: any) {
    this.conversationList.push(conversation);
  }
  
  getConversationList() {
    return this.conversationList;
  }
}
