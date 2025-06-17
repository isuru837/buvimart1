import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="edit-profile-container">
      <div class="edit-profile-card">
        <h2>Edit Profile</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onSubmit()" *ngIf="user">
          <div class="form-group">
            <label for="userName">Username:</label>
            <input type="text" id="userName" name="userName" [(ngModel)]="user.userName" required>
          </div>

          <div class="form-group">
            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" [(ngModel)]="user.firstName" required>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" [(ngModel)]="user.lastName" required>
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" [(ngModel)]="user.email" required>
          </div>

          <div class="form-group">
            <label for="mobile">Mobile:</label>
            <input type="tel" id="mobile" name="mobile" [(ngModel)]="user.mobile" required>
          </div>

          <div class="form-group">
            <label for="addressLine1">Address Line 1:</label>
            <input type="text" id="addressLine1" name="addressLine1" [(ngModel)]="user.addressLine1" required>
          </div>

          <div class="form-group">
            <label for="addressLine2">Address Line 2:</label>
            <input type="text" id="addressLine2" name="addressLine2" [(ngModel)]="user.addressLine2">
          </div>

          <div class="form-group">
            <label for="addressLine3">Address Line 3:</label>
            <input type="text" id="addressLine3" name="addressLine3" [(ngModel)]="user.addressLine3">
          </div>

          <div class="form-group">
            <label>Role:</label>
            <input type="text" [value]="user.role" disabled>
          </div>

          <div class="actions">
            <button type="submit" class="btn save-btn" [disabled]="isLoading">
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn cancel-btn" (click)="onCancel()" [disabled]="isLoading">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .edit-profile-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 80px);
      background-color: #f5f5f5;
      padding: 2rem 0;
    }

    .edit-profile-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 600px;
    }

    h2 {
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #666;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    input:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .actions {
      margin-top: 2rem;
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      flex: 1;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .save-btn {
      background-color: #28a745;
      color: white;
    }

    .save-btn:hover:not(:disabled) {
      background-color: #218838;
    }

    .cancel-btn {
      background-color: #6c757d;
      color: white;
    }

    .cancel-btn:hover:not(:disabled) {
      background-color: #5a6268;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1rem;
      text-align: center;
    }
  `]
})
export class EditProfile implements OnInit {
  user: any;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        // Create a copy of the user object to avoid direct mutation
        this.user = { ...user };
      }
    });
  }

  onSubmit() {
    if (this.user) {
      this.isLoading = true;
      this.errorMessage = '';

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const updatedUserData = {
        ...this.user,
        deleted: false
      };

      this.http.put(`${environment.apiUrl}/users/update/1`, updatedUserData, { 
        headers: headers,
        observe: 'response'
      }).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.authService.setUser(response.body);
            this.router.navigate(['/profile']);
          }
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = error.error?.message || 'Failed to update profile. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
} 