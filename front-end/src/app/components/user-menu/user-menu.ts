import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, ClickOutsideDirective],
  template: `
    <div class="user-menu" (clickOutside)="isOpen = false">
      <button class="user-button" (click)="toggleMenu()">
        <span class="username">{{ (authService.user$ | async)?.userName }}</span>
        <span *ngIf="(authService.user$ | async)?.role === 'ADMIN'" class="admin-badge">ADMIN</span>
      </button>
      
      <div class="menu-dropdown" *ngIf="isOpen">
        <a routerLink="/profile" class="menu-item">Profile</a>
        <a *ngIf="(authService.user$ | async)?.role === 'ADMIN'" routerLink="/admin" class="menu-item admin-item">Admin Dashboard</a>
        <a *ngIf="(authService.user$ | async)?.role !== 'ADMIN'" routerLink="/" class="menu-item">Products</a>
        <button (click)="logout()" class="menu-item">Sign Out</button>
      </div>
    </div>
  `,
  styles: [`
    .user-menu {
      position: relative;
      display: inline-block;
    }

    .user-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .username {
      color: #28a745;
      font-weight: 500;
    }

    .admin-badge {
      background-color: #dc3545;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: bold;
    }

    .menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      min-width: 150px;
      z-index: 1000;
    }

    .menu-item {
      display: block;
      padding: 0.75rem 1rem;
      color: #333;
      text-decoration: none;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      cursor: pointer;
    }

    .menu-item:hover {
      background-color: #f5f5f5;
    }

    .admin-item {
      color: #dc3545;
      font-weight: 500;
    }
  `]
})
export class UserMenu {
  isOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
    this.isOpen = false;
    this.router.navigate(['/']);
  }
} 