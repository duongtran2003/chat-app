import { Component, OnInit, inject } from '@angular/core';
import { MainColService } from '../../services/main-col.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAt, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService, provideToastr } from 'ngx-toastr';

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

  emailIcon = faAt;
  usernameIcon = faCircleUser;
  isEditFieldVisible = false;

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
}
