import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  user = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    email: '',
    mobile: '',
    role: 'REG_USER'
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post(`${environment.apiUrl}/api/users/register`, this.user).subscribe({
      next: (res) => {
        this.successMessage = 'Registration successful!';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
