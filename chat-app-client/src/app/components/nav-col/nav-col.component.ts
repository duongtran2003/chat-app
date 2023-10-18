import { Component } from '@angular/core';
import { faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-nav-col',
  templateUrl: './nav-col.component.html',
  styleUrls: ['./nav-col.component.css']
})
export class NavColComponent {
  userIcon = faUser;
}
