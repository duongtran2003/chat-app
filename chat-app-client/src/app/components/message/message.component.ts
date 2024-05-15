import { Component, Input, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  @Input() message: any;

  private userService = inject(UserService);

  formattedTimestamp: string = "";

  ngOnInit(): void {
    this.timeParser();
  }

  isOwner() {
    let currentUser = this.userService.getUser();
    return currentUser._id == this.message.sender;
  }

  timeParser() {
    let formatted = new Date(this.message.createdAt);
    this.formattedTimestamp = formatted.toLocaleString();
  }
}
