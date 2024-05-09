import { Component, Input, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MainColService } from '../../services/main-col.service';

@Component({
  selector: 'app-friend-request',
  standalone: true,
  imports: [],
  templateUrl: './friend-request.component.html',
  styleUrl: './friend-request.component.css'
})
export class FriendRequestComponent implements OnInit {
  @Input() request: any;

  sender: any;

  private mainCol = inject(MainColService);
  private userService = inject(UserService);

  constructor() { }

  ngOnInit(): void {
    this.userService.getUserInfo(this.request.sender).subscribe({
      next: (res) => {
        this.sender = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  showProfile() {
    this.mainCol.switchTab(1, this.sender._id);
  }
}
