import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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

  constructor(
    private router: Router,
     private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post(`${environment.apiUrl}/api/users/register`, this.user).subscribe({
      next: (res) => {
        this.zone.run(() => {
        this.successMessage = 'Registration successful!';
        this.user = {
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
        this.cdr.detectChanges();
        })
      },
      error: (err) => {
        this.zone.run(() => {
        console.log('Error response:', err);
        console.log('Error object:', err.error);
        console.log('Error message:', err.error?.error);
        this.errorMessage = err?.error?.error || 'Registration failed.';
        this.cdr.detectChanges();
        console.log('Final error message:', this.errorMessage);}
        )
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
