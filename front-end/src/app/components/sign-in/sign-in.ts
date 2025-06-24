import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  credentials = {
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
    this.errorMessage = '';
    this.isLoading = true;

    this.authService.login(this.credentials.userName, this.credentials.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log("User "+response.body.user)
        console.log('Login successful, user role:', response.body.user.role);
        
        // Redirect based on user role
        if (response.body.user.role === 'ADMIN') {
          console.log('Admin user logged in, redirecting to admin dashboard');
          this.router.navigate(['/admin']);
        } else {
          console.log('Regular user logged in, redirecting to main page');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.log('Error:######', error.message);
        this.errorMessage = error.message || 'An error occurred during sign in';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
