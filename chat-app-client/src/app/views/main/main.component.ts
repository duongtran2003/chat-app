import { Component, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment.development';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnDestroy {
  private userService = inject(UserService);
  private router = inject(Router);

  private socket: any;

  user: any;


  constructor() {
    this.user = this.userService.getUser();
    if (!this.user.length) {
      this.userService.fetchUser().subscribe({
        next: (user) => {
          this.user = user;
          this.socket = io(environment.apiUrl, { forceNew: true, withCredentials: true });
        }
      });
    }
    else {
      this.socket = io(environment.apiUrl, { forceNew: true });
    }
  }
  ngOnDestroy(): void {
    console.log("main destroyed");
  }

  logout() {
    this.socket.disconnect();
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
