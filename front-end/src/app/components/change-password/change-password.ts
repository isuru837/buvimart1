import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {
  oldPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  validationErrors: { [key: string]: string } = {};
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient,
    private cdr:ChangeDetectorRef,
    private zone:NgZone

  ) {}

  validateNewPassword(password: string): boolean {
    const hasMinLength = password && password.length >= 8;
    const hasCapitalLetter = /[A-Z]/.test(password);
    const hasLowercaseLetter = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const missingRequirements = [];
    if (!hasMinLength) missingRequirements.push('8 characters');
    if (!hasCapitalLetter) missingRequirements.push('1 uppercase letter');
    if (!hasLowercaseLetter) missingRequirements.push('1 lowercase letter');
    if (!hasNumber) missingRequirements.push('1 number');
    if (!hasSymbol) missingRequirements.push('1 symbol (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    if (missingRequirements.length > 0) {
      this.validationErrors['newPassword'] = `Password must contain at least: ${missingRequirements.join(', ')}.`;
      return false;
    }
    delete this.validationErrors['newPassword'];
    return true;
  }

  validateForm(): boolean {
    this.validationErrors = {};
    if (!this.oldPassword) {
      this.validationErrors['oldPassword'] = 'Old password is required.';
    }
    const isNewPasswordValid = this.validateNewPassword(this.newPassword);
    if (!this.newPassword) {
      this.validationErrors['newPassword'] = 'New password is required.';
    }
    if (!this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Please re-type the new password.';
    } else if (this.newPassword !== this.confirmPassword) {
      this.validationErrors['confirmPassword'] = 'Passwords do not match.';
    }
    return Object.keys(this.validationErrors).length === 0;
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';
    if (!this.validateForm()) {
      return;
    }
    const payload = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword,
      retypeNewPassword: this.confirmPassword
    };
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.post(`${environment.apiUrl}/api/users/change-password`, payload, { headers }).subscribe({
      next: (res: any) => {
        this.zone.run(()=>{
            
        this.successMessage = res?.message || 'Password changed successfully.';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.cdr.detectChanges();
    })
      },
      error: (err) => {
        this.zone.run(()=>{
            this.errorMessage = err?.error?.error || 'Failed to change password.';
            this.cdr.detectChanges();
        })
      }
    });
  }
} 