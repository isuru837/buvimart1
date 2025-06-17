import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>User Profile</h2>
        
        <div class="profile-info" *ngIf="user">
          <div class="info-group">
            <label>Username:</label>
            <span>{{ user.userName }}</span>
          </div>

          <div class="info-group">
            <label>First Name:</label>
            <span>{{ user.firstName }}</span>
          </div>

          <div class="info-group">
            <label>Last Name:</label>
            <span>{{ user.lastName }}</span>
          </div>

          <div class="info-group">
            <label>Email:</label>
            <span>{{ user.email }}</span>
          </div>

          <div class="info-group">
            <label>Mobile:</label>
            <span>{{ user.mobile }}</span>
          </div>

          <div class="info-group">
            <label>Address Line 1:</label>
            <span>{{ user.addressLine1 }}</span>
          </div>

          <div class="info-group" *ngIf="user.addressLine2">
            <label>Address Line 2:</label>
            <span>{{ user.addressLine2 }}</span>
          </div>

          <div class="info-group" *ngIf="user.addressLine3">
            <label>Address Line 3:</label>
            <span>{{ user.addressLine3 }}</span>
          </div>

          <div class="info-group">
            <label>Role:</label>
            <span>{{ user.role }}</span>
          </div>
        </div>

        <div class="actions">
          <button class="btn edit-btn" routerLink="/profile/edit">Edit Profile</button>
          <button class="btn back-btn" routerLink="/">Back to Home</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: calc(100vh - 80px);
      background-color: #f5f5f5;
      padding: 2rem 0;
    }

    .profile-card {
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

    .profile-info {
      display: grid;
      gap: 1.5rem;
    }

    .info-group {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
      align-items: center;
    }

    .info-group label {
      color: #666;
      font-weight: 500;
    }

    .info-group span {
      color: #333;
      padding: 0.5rem;
      background-color: #f8f9fa;
      border-radius: 4px;
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

    .edit-btn {
      background-color: #28a745;
      color: white;
    }

    .edit-btn:hover {
      background-color: #218838;
    }

    .back-btn {
      background-color: #6c757d;
      color: white;
    }

    .back-btn:hover {
      background-color: #5a6268;
    }
  `]
})
export class Profile implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }
} 