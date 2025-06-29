import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile implements OnInit, OnDestroy {
  user: any = {
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    role: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;
  validationErrors: { [key: string]: string } = {};
  private userSubscription: Subscription;
  originalUser: any = {};

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) {
        this.user = { ...user };
        this.originalUser = { ...user };
      } else {
        this.router.navigate(['/sign-in']);
      }
    });
  }

  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // Username validation: minimum 8 characters
  validateUsername(username: string): boolean {
    if (!username || username.length < 8) {
      this.validationErrors['userName'] = 'Username must be at least 8 characters long.';
      return false;
    }
    delete this.validationErrors['userName'];
    return true;
  }

  // Validate all fields
  validateForm(): boolean {
    this.validationErrors = {};
    
    const isUsernameValid = this.validateUsername(this.user.userName);
    
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
    
    return isUsernameValid && Object.keys(this.validationErrors).length === 0;
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    // Validate form before submission
    if (!this.validateForm()) {
      this.isLoading = false;
      return;
    }

    // Use the AuthService's updateUser method
    this.authService.updateUser(this.user).subscribe({
      next: (response) => {
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to update profile. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  isFormDirty(): boolean {
    // Compare each field in user and originalUser
    for (const key of Object.keys(this.user)) {
      if (this.user[key] !== this.originalUser[key]) {
        return true;
      }
    }
    return false;
  }
} 