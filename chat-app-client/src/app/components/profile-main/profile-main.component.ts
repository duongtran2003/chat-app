import { Component, OnInit, inject } from '@angular/core';
import { MainColService } from '../../services/main-col.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAt, faCircleUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css'
})
export class ProfileMainComponent implements OnInit {
  
  private mainCol = inject(MainColService);
  private userService = inject(UserService);

  emailIcon = faAt;
  usernameIcon = faCircleUser;
  isEditFieldVisible = false;

  currentUser: any = {};
  currentProfile: any = {};

  constructor() {
    this.currentUser = this.userService.getUser();
    this.userService.getUserInfo(this.mainCol.getCurrentTabId()).subscribe({
      next: (user) => {
        this.currentProfile = user;
        console.log(user);
      }
    });
  }

  ngOnInit(): void {
    this.mainCol.currentMainTabId$.subscribe({
      next: (id) => {
        this.userService.getUserInfo(id).subscribe({
          next: (user) => {
            this.currentProfile = user;
            console.log(user);
          }
        });
      }
    });
  }

  toggleEdit() {
    this.isEditFieldVisible = !this.isEditFieldVisible;
  }
}
