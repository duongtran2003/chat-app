import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'chat-app-client';
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {  }
  
  ngOnInit(): void {
    this.userService.fetchUser().subscribe({
      next: (user) => {
        this.userService.setUser(user);
        this.router.navigate(['/']);
      },
      error: (err) => {
        let statusCode = err.status;
        if (statusCode === 401) {
          //redirect to login page
          this.router.navigate(["/login"]);
        }
        if (statusCode === 500) {
          this.ngOnInit(); 
        }
      }
    });
  }
}
