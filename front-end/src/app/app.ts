import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
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
export class App {
  protected title = 'front-end';

  constructor(
    public authService: AuthService,
    private searchService: SearchService
  ) {}

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('App: Search input changed to:', target.value);
    this.searchService.setSearchTerm(target.value);
  }
}
