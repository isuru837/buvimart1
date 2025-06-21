import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UserMenu } from './components/user-menu/user-menu';
import { AuthService } from './services/auth.service';
import { SearchService } from './services/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserMenu, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'front-end';

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to user changes to handle role-based routing
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User logged in, checking role:', user.role);
        if (user.role === 'ADMIN') {
          // If admin user is on the main page, redirect to admin dashboard
          if (this.router.url === '/') {
            console.log('Admin user detected, redirecting to admin dashboard');
            this.router.navigate(['/admin']);
          }
        } else {
          // If regular user is on admin page, redirect to main page
          if (this.router.url === '/admin') {
            console.log('Regular user on admin page, redirecting to main page');
            this.router.navigate(['/']);
          }
        }
      }
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('App: Search input changed to:', target.value);
    this.searchService.setSearchTerm(target.value);
  }
}
