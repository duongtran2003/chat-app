import { Component, Input, inject } from '@angular/core';
import { MainColService } from '../../services/main-col.service';

@Component({
  selector: 'app-friend-mini-profile',
  standalone: true,
  imports: [],
  templateUrl: './friend-mini-profile.component.html',
  styleUrl: './friend-mini-profile.component.css'
})
export class FriendMiniProfileComponent {
  @Input() user: any;
  private mainCol = inject(MainColService);

  showProfile() {
    this.mainCol.switchTab(1, this.user._id);
  }
}
