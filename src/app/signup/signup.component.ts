import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClientModule } from '@angular/common/http';
import { Router ,RouterModule} from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule ,RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupEmail = '';
  signupPassword = '';


  constructor(private auth: AuthService, private router: Router) {}

   signup() {
    if (!this.signupEmail || !this.signupPassword) {
      alert('Please enter email and password to signup!');
      return;
    }

    this.auth.signup(this.signupEmail, this.signupPassword).subscribe({
      next: (res) => {
        alert('Signup successful! You can now login.');
        this.signupEmail = '';
        this.signupPassword = '';
        this.router.navigate(['/login']); // redirect to login page
      },
      error: (err) => alert(err.error?.message || 'Signup failed'),
    });
  }
}