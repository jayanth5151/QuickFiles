import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.logout(); // <-- clears token when page/component loads
  }

  logout() {
    this.auth.logout();
  }
  login() {
    if (!this.email || !this.password) {
      alert('Please enter email and password!');
      return;
    }

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.saveToken(res.token);
        // navigate to home paged
        this.router.navigate(['/home']);
      },
      error: (err) =>
        alert(err.error?.message || 'Login failed or Invalid credentials'),
    });
  }
}
