import { Component, inject, OnInit } from '@angular/core';
import { FriendRequestService } from '../../services/friend-request.service';
import { FriendRequestComponent } from '../friend-request/friend-request.component';

@Component({
  selector: 'app-sub-friend-requests-col',
  standalone: true,
  imports: [FriendRequestComponent],
  templateUrl: './sub-friend-requests-col.component.html',
  styleUrl: './sub-friend-requests-col.component.css'
})
export class SubFriendRequestsColComponent implements OnInit {
  private requestService = inject(FriendRequestService);
  requestList: any[];

  constructor() {
    this.requestList = [];
    this.requestService.clearSignal$.subscribe({
      next: () => {
        this.requestList = [];
      }
    })
    this.requestService.requestList$.subscribe({
      next: (request) => {
        this.requestList.push(request);
      }
    });
  }

  ngOnInit(): void {
    this.fetchAllRequests();
    console.log(this.requestList);
  }

  fetchAllRequests() {
    this.requestList = [];
    this.requestService.fetchAllRequests();
  }
}
