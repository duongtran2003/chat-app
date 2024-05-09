import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  private userService = inject(UserService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  //validator state
  isValid = {
    email: true,
    emailErr: "",
    username: true,
    usernameErr: "",
    password: true,
    passwordErr: "",
    passwordConfirm: true,
    passwordConfirmErr: "",
  }



  registerForm = new FormGroup({
    email: new FormControl(""),
    username: new FormControl(""),
    password: new FormControl(""),
    passwordConfirm: new FormControl("")
  });

  ngOnInit(): void {
    this.userService.fetchUser().subscribe({
      next: (user) => {
        this.userService.setUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        const statusCode = err.status;
        if (statusCode == 500) {
          this.ngOnInit();
        }
      }
    });
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault();
    //validate start
    //email
    if (this.registerForm.value.email) {
      if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.registerForm.value.email))) {
        this.isValid.email = false;
        this.isValid.emailErr = "That's not an email";
      }
      else {
        this.isValid.email = true;
        this.isValid.emailErr = "";
      }
    }
    else {
      this.isValid.email = false;
      this.isValid.emailErr = "That's not an email";
    }

    //username
    if (this.registerForm.value.username) {
      if (!(/^[a-zA-Z0-9_]{6,20}$/.test(this.registerForm.value.username))) {
        this.isValid.username = false;
        this.isValid.usernameErr = "Only alphabetic characters, numbers and underscores are allowed. Length must be between 6 and 20 characters";
      }
      else {
        this.isValid.username = true;
        this.isValid.usernameErr = "";
      }
    }
    else {
      this.isValid.username = false;
      this.isValid.usernameErr = "Only alphabetic characters, numbers and underscores are allowed. Length must be between 6 and 20 characters";
    }

    //password
    if (this.registerForm.value.password) {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/.test(this.registerForm.value.password)) {
        this.isValid.password = false;
        this.isValid.passwordErr = "At least one alphabetic character, one digit and length must be between 8 and 20 characters";
      }
      else {
        this.isValid.password = true;
        this.isValid.passwordErr = "";
      }
    }
    else {
      this.isValid.password = false;
      this.isValid.passwordErr = "At least one alphabetic character, one digit and length must be between 8 and 20 characters";
    }

    //password confirm
    if (this.registerForm.value.passwordConfirm) {
      if (this.registerForm.value.passwordConfirm !== this.registerForm.value.password) {
        this.isValid.passwordConfirm = false;
        this.isValid.passwordConfirmErr = "Password does not match";
      }
      else {
        this.isValid.passwordConfirm = true;
        this.isValid.passwordConfirmErr = "";
      }
    }
    else {
      this.isValid.passwordConfirm = false;
      this.isValid.passwordConfirmErr = "Password does not match";
    }
    //validator end

    if (this.isValid.email && this.isValid.username && this.isValid.password && this.isValid.passwordConfirm) {

      const newUser = {
        "email": this.registerForm.value.email || "",
        "username": this.registerForm.value.username || "",
        "password": this.registerForm.value.password || ""
      }

      this.userService.newUser(newUser).subscribe({
        next: (user) => {
          this.toastr.success("You've successfully created a new account");
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.status === 409) {
            if (err.error.message === "duplicated username") {
              this.isValid.username = false;
              this.isValid.usernameErr = "Username's already been used"
            }
            if (err.error.message === "duplicated email") {
              this.isValid.email = false;
              this.isValid.emailErr = "Email's already been used"
            }
          }
          else if (err.status === 400) {
            this.isValid.passwordErr = "At least one alphabetic character, one digit and length must be between 8 and 20 characters";
            this.isValid.usernameErr = "Only alphabetic characters, numbers and underscores are allowed. Length must be between 6 and 20 characters";
            this.isValid.emailErr = "That's not an email";
            this.isValid.email = false;
            this.isValid.username = false;
            this.isValid.password = false;
          }
          else {
            this.isValid.email = false;
            this.isValid.username = false;
            this.isValid.password = false;
            this.isValid.passwordConfirm = false;
            this.isValid.passwordConfirmErr = "Server's error, try again!"
          }
        }
      });
    }
  }
}
