import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
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
    role: 'REG-USER'
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Submitted:', this.user);
    // You can send this object to your backend via a service
    // Example: this.authService.register(this.user).subscribe(...)
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
