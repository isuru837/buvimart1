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
  validationErrors: { [key: string]: string } = {};

  constructor(
    private router: Router,
     private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  // Username validation: minimum 8 characters
  validateUsername(username: string): boolean {
    if (!username || username.length < 8) {
      this.validationErrors['userName'] = 'Username must be at least 8 characters long.';
      return false;
    }
    delete this.validationErrors['userName'];
    return true;
  }

  // Password validation: minimum 8 characters, at least 1 capital letter, 1 lowercase letter, 1 number, and 1 symbol
  validatePassword(password: string): boolean {
    const hasMinLength = password && password.length >= 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasLowercaseLetter = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const missingRequirements = [];
    if (!hasMinLength) {
      missingRequirements.push('8 characters');
    }
    if (!hasCapitalLetter) {
      missingRequirements.push('1 uppercase letter');
    }
    if (!hasLowercaseLetter) {
      missingRequirements.push('1 lowercase letter');
    }
    if (!hasNumber) {
      missingRequirements.push('1 number');
    }
    if (!hasSymbol) {
      missingRequirements.push('1 symbol (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    }

    if (missingRequirements.length > 0) {
      this.validationErrors['password'] = `Password must contain at least: ${missingRequirements.join(', ')}.`;
      return false;
    }
    delete this.validationErrors['password'];
    return true;
  }

  // Validate all fields
  validateForm(): boolean {
    this.validationErrors = {};
    
    const isUsernameValid = this.validateUsername(this.user.userName);
    const isPasswordValid = this.validatePassword(this.user.password);
    
    // Check other required fields
    if (!this.user.firstName?.trim()) {
      this.validationErrors['firstName'] = 'First name is required.';
    }
    
    if (!this.user.lastName?.trim()) {
      this.validationErrors['lastName'] = 'Last name is required.';
    }
    
    if (!this.user.email?.trim()) {
      this.validationErrors['email'] = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      this.validationErrors['email'] = 'Please enter a valid email address.';
    }
    
    if (!this.user.mobile?.trim()) {
      this.validationErrors['mobile'] = 'Mobile number is required.';
    }
    
    if (!this.user.addressLine1?.trim()) {
      this.validationErrors['addressLine1'] = 'Address Line 1 is required.';
    }
    
    return isUsernameValid && isPasswordValid && Object.keys(this.validationErrors).length === 0;
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    
    // Validate form before submission
    if (!this.validateForm()) {
      return;
    }
    
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
        this.validationErrors = {};
        this.cdr.detectChanges();
        })
      },
      error: (err) => {
        this.zone.run(() => {
        this.errorMessage = err?.error?.error || 'Registration failed.';
        this.cdr.detectChanges();
        })
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
