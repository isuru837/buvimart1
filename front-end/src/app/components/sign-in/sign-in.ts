import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  user = {
    userName: '',
    password: ''
  };

  onSubmit() {
    console.log('Submitted:', this.user);

    // You can send this object to your backend via a service
    // Example: this.authService.login(this.user).subscribe(...)
  }
}
