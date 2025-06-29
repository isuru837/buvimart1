import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup-overlay" (click)="onExit()">
      <div class="popup-content" (click)="$event.stopPropagation()">
        <div class="popup-header">
          <h3 *ngIf="showLoginButton">Login Required</h3>
          <h3 *ngIf="!showLoginButton">Message</h3>
        </div>
        <div class="popup-body">
          <p>{{ message }}</p>
        </div>
        <div class="popup-footer">
          <button *ngIf="showLoginButton" class="btn btn-primary" (click)="onLogin()">Login</button>
          <button *ngIf="showLoginButton" class="btn btn-secondary" (click)="onExit()">Exit</button>
          <button *ngIf="!showLoginButton" class="btn btn-primary" (click)="onOk()">{{ okButtonText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .popup-content {
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .popup-header {
      text-align: center;
      margin-bottom: 15px;
    }

    .popup-header h3 {
      margin: 0;
      color: #333;
      font-size: 1.2rem;
    }

    .popup-body {
      text-align: center;
      margin-bottom: 20px;
    }

    .popup-body p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }

    .popup-footer {
      display: flex;
      gap: 10px;
      justify-content: center;
    }

    .btn {
      padding: 8px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class LoginPopup {
  @Input() message: string = 'Please sign in to complete your transaction.';
  @Input() okButtonText: string = 'OK';
  @Input() showLoginButton: boolean = true;
  @Output() login = new EventEmitter<void>();
  @Output() exit = new EventEmitter<void>();
  @Output() ok = new EventEmitter<void>();

  constructor(private router: Router) {}

  onLogin() {
    this.login.emit();
    this.router.navigate(['/sign-in']);
  }

  onExit() {
    this.exit.emit();
  }

  onOk() {
    this.ok.emit();
  }
} 