import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { UserMenu } from './components/user-menu/user-menu';
import { AuthService } from './services/auth.service';
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

  constructor(public authService: AuthService) {}
}
