import { Component, OnInit, inject } from '@angular/core';
import { MainColService } from '../../services/main-col.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAt, faCircleUser, faEnvelope, faUserPlus, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { FriendRequestService } from '../../services/friend-request.service';

@Component({
  selector: 'app-profile-main',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, FormsModule],
  templateUrl: './profile-main.component.html',
  styleUrl: './profile-main.component.css',
})
export class ProfileMainComponent implements OnInit {

  private mainCol = inject(MainColService);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private friendRequestService = inject(FriendRequestService);

  emailIcon = faAt;
  usernameIcon = faCircleUser;
  addFriendIcon = faUserPlus;
  sendMessageIcon = faEnvelope;
  cancelIcon = faXmark;
  acceptIcon = faCheck;

  isEditFieldVisible = false;

  notFriendStatus = 0 | 1 | -1; // 0 - not friend, 1 - request sent, -1 - request received

  isValid = {
    email: true,
    emailErr: "That's not an email",
    username: true,
    usernameErr: "Only alphabetic characters, numbers and underscores are allowed. Length must be between 6 and 20 characters",
    password: true,
    passwordErr: "At least one alphabetic character, one digit and length must be between 8 and 20 characters",
  }

  formValue = {
    username: "",
    email: "",
    avatar: "",
    password: "",
    oldPassowrd: "",
  }

  currentUser: any = {};
  currentProfile: any = {};
  isFriend: boolean;

  constructor() {
    this.isFriend = false;
    this.currentUser = this.userService.getUser();
    this.checkFriendStatus();
    this.userService.getUserInfo(this.mainCol.getCurrentTabId()).subscribe({
      next: (user) => {
        this.currentProfile = user;
        this.isFriend = this.userService.isFriend(this.currentProfile._id);
        this.checkFriendStatus();
      }
    });
  }

  ngOnInit(): void {
    this.checkFriendStatus();
    this.mainCol.currentMainTabId$.subscribe({
      next: (id) => {
        this.userService.getUserInfo(id).subscribe({
          next: (user) => {
            console.log(user);
            this.currentProfile = user;
            this.isFriend = this.userService.isFriend(this.currentProfile._id);
            this.checkFriendStatus();
          }
        });
      }
    });
  }

  toggleEdit() {
    this.isEditFieldVisible = !this.isEditFieldVisible;
  }

  submit() {
    if (this.formValue.username != "") {
      if (!(/^[a-zA-Z0-9_]{6,20}$/.test(this.formValue.username))) {
        this.isValid.username = false;
      }
      else {
        this.isValid.username = true;
      }
    }
    else {
      this.isValid.username = true;
    }

    if (this.formValue.email != "") {
      if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.formValue.email))) {
        this.isValid.email = false;
      }
      else {
        this.isValid.email = true;
      }
    }
    else {
      this.isValid.email = true;
    }

    if (this.formValue.password != "") {
      if (!(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(this.formValue.password))) {
        this.isValid.password = false;
      }
      else {
        this.isValid.password = true;
      }
    }
    else {
      this.isValid.password = true;
    }

    if (this.isValid.username && this.isValid.email && this.isValid.password) {
      const payload = {
        username: this.formValue.username == "" ? undefined : this.formValue.username,
        email: this.formValue.email == "" ? undefined : this.formValue.email,
        pfp: this.formValue.avatar == "" ? undefined : this.formValue.avatar,
        password: this.formValue.password == "" ? undefined : this.formValue.password,
        oldPassword: this.formValue.oldPassowrd == "" ? undefined : this.formValue.oldPassowrd,
      }
      this.userService.updateUser(payload).subscribe({
        next: (res) => {
          console.log(res);
          // alert("thanh cong");
          this.toastr.success("You've successfully updated your profile", "Success");
          this.currentProfile = res;
          this.userService.setUser(res);
          this.currentUser = res;
          this.isEditFieldVisible = !this.isEditFieldVisible;
        },
        error: (err) => {
          // alert(err.error.message);
          this.toastr.error(err.error.message, "Error");
        }
      })
    }
  }

  checkFriendStatus() {
    if (!this.currentProfile._id) {
      return;
    }
    this.friendRequestService.checkRequest(this.currentProfile._id).subscribe({
      next: (res) => {
        console.log(res);
        if (res.sender == this.currentUser._id) {
          this.notFriendStatus = 1;
        }
        if (res.recipient == this.currentUser._id) {
          this.notFriendStatus = -1;
        }
      },
      error: (error) => {
        this.notFriendStatus = 0;
        console.log(error);
      }
    })
  }

  sendFriendRequest() {
    if (!this.currentProfile._id) {
      return;
    }
    this.friendRequestService.sendFriendRequest(this.currentProfile._id).subscribe({
      next: (res) => {
        this.checkFriendStatus();
      }
    });
  }

  deleteFriendRequest() {
    if (!this.currentProfile._id) {
      return;
    }
    this.friendRequestService.deleteFriendRequest(this.currentProfile._id).subscribe({
      next: (res) => {
        this.notFriendStatus = 0;
      },
      error: () => {
        this.toastr.error("Request not found", "Error");
        this.ngOnInit();
        this.isFriend = this.userService.isFriend(this.currentProfile._id);
      },
      complete: () => {
        this.friendRequestService.fetchAllRequests();
      }
    })
  }

  declineFriendRequest() {
    if (!this.currentProfile._id) {
      return;
    }
    this.friendRequestService.declineFriendRequest(this.currentProfile._id).subscribe({
      next: (res) => {
        this.notFriendStatus = 0;
      },
      error: () => {
        this.toastr.error("Request not found", "Error");
        this.ngOnInit();
      },
      complete: () => {
        this.friendRequestService.fetchAllRequests();
      }
    })
  }

  acceptFriendRequest() {
    if (!this.currentProfile._id) {
      return;
    }
    this.friendRequestService.acceptFriendRequest(this.currentProfile._id).subscribe({
      next: (res) => {
        this.isFriend = true;
        this.userService.addNewFriend(this.currentProfile._id);
      },
      error: () => {
        this.toastr.error("Request not found", "Error");
        this.ngOnInit();
      },
      complete: () => {
        this.friendRequestService.fetchAllRequests();
      }
    })
  }

  sendMessage() {

  }
}
