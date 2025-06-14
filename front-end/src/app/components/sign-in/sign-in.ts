import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  user = {
    userName: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Submitted:', this.user);

    // You can send this object to your backend via a service
    // Example: this.authService.login(this.user).subscribe(...)
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
