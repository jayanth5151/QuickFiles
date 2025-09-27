import { Component, AfterViewInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // <-- import RouterModule
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule], // <-- add RouterModule here
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  constructor(private authService: AuthService, private router: Router) { }
  ngAfterViewInit() {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (hamburger && sidebar && overlay) {
      hamburger.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
    }
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
