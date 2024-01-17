import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  
  user: any; 

  constructor() {
    this.user = this.userService.getUser(); 
    if (!this.user.length) {
      this.userService.fetchUser().subscribe({
        next: (user) => {
          this.user = user;
        }
      });
    }
  }
  
  logout() {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
