import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private userService = inject(UserService);
  private router = inject(Router);
  //validator state 
  isValid: boolean = true;


  googleIcon = faGoogle;
  facebookIcon = faFacebook;
  twitterIcon = faTwitter;
  loginForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });

  onSubmit(e: SubmitEvent) {
    e.preventDefault();

    const credentials = {
      "username": this.loginForm.value.username || "",
      "password": this.loginForm.value.password || "",
    }

    this.userService.login(credentials).subscribe({
      next: (user) => {
        this.userService.setUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isValid = false;
      }
    });
  }
}
