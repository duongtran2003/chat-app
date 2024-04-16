import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-friend-mini-profile',
  standalone: true,
  imports: [],
  templateUrl: './friend-mini-profile.component.html',
  styleUrl: './friend-mini-profile.component.css'
})
export class FriendMiniProfileComponent {
  @Input() user: any;
}
