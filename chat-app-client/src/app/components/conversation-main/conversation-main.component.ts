import { Component, OnInit, OnDestroy, AfterViewChecked, inject, ViewChild, ElementRef } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { MainColService } from '../../services/main-col.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageComponent } from '../message/message.component';
import { WebsocketService } from '../../services/websocket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversation-main',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MessageComponent, CommonModule],
  templateUrl: './conversation-main.component.html',
  styleUrl: './conversation-main.component.css'
})
export class ConversationMainComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('scrollMe') private scrollingContainer!: ElementRef;

  private conversationService = inject(ConversationsService);
  private mainCol = inject(MainColService);
  private userService = inject(UserService);
  private ws = inject(WebsocketService);

  conversation: any = {};

  otherUser: any = {};
  currentUser: any = {};

  messages: any = [];

  chatForm = new FormGroup({
    chatInput: new FormControl(""),
  })

  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    this.scrollToBottom();
    this.subscriptions.push(
      this.mainCol.currentMainTabId$.subscribe({
        next: (res) => {
          this.conversationService.fetchConversationById(res).subscribe({
            next: (res) => {
              this.conversation = res;
              this.getMemberInfo();
              this.messages = [];
              this.fetchAllMessages();
            }
          })
        }
      }),
      this.conversationService.messageList$.subscribe({
        next: (res) => {
          this.messages.push(res);
        }
      }),
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
      this.ws.listen('message-seen').subscribe({
        next: (data: any) => {
          if (data.conversationId == this.conversation._id) {
            for (let message of this.messages) {
              if (message._id == data._id) {
                message.isSeen = true;
              }
            }
          }
        }
      }),
      this.ws.listen('new-message').subscribe({
        next: (data: any) => {
          this.conversationService.checkNewMessage();
          if (data.conversationId == this.conversation._id) {
            this.conversationService.fetchMessageById(data._id).subscribe({
              next: (res) => {
                this.messages.push(res);
                this.conversationService.checkNewMessage();
                this.conversationService.conversationCheckedSignal$.next(this.conversation._id);
              }
            })
          }
        }
      })
    );
    this.conversationService.fetchConversationById(this.mainCol.getCurrentTabId()).subscribe({
      next: (res) => {
        this.conversation = res;
        this.getMemberInfo();
        this.messages = [];
        this.fetchAllMessages();
      }
    })
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  getMemberInfo() {
    if (!this.conversation.members) {
      return;
    }
    for (let memberId of this.conversation.members) {
      if (memberId != this.currentUser._id) {
        this.userService.getUserInfo(memberId).subscribe({
          next: (res) => {
            this.otherUser = res;
          }
        })
      }
    }
  }

  switchToUserProfile() {
    this.mainCol.switchTab(1, this.otherUser._id);
  }

  sendMessage(e: SubmitEvent) {
    e.preventDefault();
    let chatString = this.chatForm.value.chatInput;
    if (!chatString) {
      return;
    }
    chatString = chatString.trim();
    if (chatString == "") {
      return;
    }
    //Call message create api
    const payload = {
      conversationId: this.conversation._id,
      content: chatString,
    }
    this.conversationService.createNewMessage(payload).subscribe({
      next: (res) => {
        this.messages.push(res);
        this.conversationService.lastMessageSignal$.next({ id: this.conversation._id, content: chatString });
      }
    })
    this.chatForm.patchValue({
      chatInput: "",
    })
  }

  fetchAllMessages() {
    this.conversationService.fetchAllMessages(this.conversation._id);
  }

  scrollToBottom() {
    try {
      this.scrollingContainer.nativeElement.scrollTop = this.scrollingContainer.nativeElement.scrollHeight;
    }
    catch (err) {
      console.log(err);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
