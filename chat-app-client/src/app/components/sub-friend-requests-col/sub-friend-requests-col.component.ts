import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FriendRequestService } from '../../services/friend-request.service';
import { FriendRequestComponent } from '../friend-request/friend-request.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sub-friend-requests-col',
  standalone: true,
  imports: [FriendRequestComponent],
  templateUrl: './sub-friend-requests-col.component.html',
  styleUrl: './sub-friend-requests-col.component.css'
})
export class SubFriendRequestsColComponent implements OnInit, OnDestroy {
  private requestService = inject(FriendRequestService);

  requestList: any[];

  subscriptions: Subscription[] = [];

  constructor() {
    this.requestList = [];
    this.subscriptions.push(
      this.requestService.clearSignal$.subscribe({
        next: () => {
          this.requestList = [];
        }
      }),
      this.requestService.requestList$.subscribe({
        next: (request) => {
          this.requestList.push(request);
        }
      })
    );
  }

  ngOnInit(): void {
    this.fetchAllRequests();
    console.log(this.requestList);
  }

  fetchAllRequests() {
    this.requestList = [];
    this.requestService.fetchAllRequests();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
