import { Component } from '@angular/core';
import { RouterModule ,Router} from '@angular/router'; // <-- import RouterModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule], // <-- add RouterModule here
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
constructor(private authService: AuthService, private router: Router) {}
onLogout() {
  this.authService.logout();
  this.router.navigate(['/login']);
}
}
