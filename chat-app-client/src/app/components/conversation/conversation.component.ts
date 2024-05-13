import { Component, OnInit, Input, inject } from '@angular/core';
import { ConversationsService } from '../../services/conversations.service';
import { UserService } from '../../services/user.service';
import { MainColService } from '../../services/main-col.service';

@Component({
  selector: 'app-conversation',
  standalone: true,
  imports: [],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css'
})
export class ConversationComponent implements OnInit {
  @Input() conversation: any;

  private userService = inject(UserService);
  private mainCol = inject(MainColService);


  otherUser: any;
  currentUser: any;


  ngOnInit(): void {
    this.currentUser = this.userService.getUser();
    for (let userId of this.conversation.members) {
      if (userId != this.currentUser._id) {
        this.userService.getUserInfo(userId).subscribe({
          next: (res) => {
            this.otherUser = res;
          }
        })
      }
    }
  }

  showProfile() {
    this.mainCol.switchTab(2, this.conversation._id);
  }
}
