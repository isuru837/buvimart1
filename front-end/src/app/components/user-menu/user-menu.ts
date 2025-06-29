import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, RouterLink, ClickOutsideDirective],
  templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenu {
  isOpen = false;
  @Output() loggedOut = new EventEmitter<void>();

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
    this.loggedOut.emit();
  }
} 