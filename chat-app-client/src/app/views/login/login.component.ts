import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGoogle, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private api = inject(ApiService);
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
    console.log(this.loginForm.value);
    this.api.post('auth/login', {
      "username": this.loginForm.value.username,
      "password": this.loginForm.value.password,
    }).subscribe({
      next: (user) => {
        console.log(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isValid = false;
      }
    })
  }
}
