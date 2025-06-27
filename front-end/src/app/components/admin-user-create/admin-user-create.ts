import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-user-create.html',
  styleUrl: './admin-user-create.css'
})
export class AdminUserCreate {
  @Output() exit = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();

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
    role: 'ADMIN'
  };

  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.http.post(`${environment.apiUrl}/api/users/register`, this.user).subscribe({
      next: (res) => {
        this.successMessage = 'Admin user created successfully!';
        this.userCreated.emit();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Failed to create admin user.';
      }
    });
  }

  onClear() {
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
      role: 'ADMIN'
    };
    this.errorMessage = '';
    this.successMessage = '';
  }

  onExit() {
    this.exit.emit();
  }
} 