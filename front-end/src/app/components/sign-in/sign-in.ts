import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  user = {
    userName: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.user.userName, this.user.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Store the token or user data if needed
        localStorage.setItem('token', response.token);
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
