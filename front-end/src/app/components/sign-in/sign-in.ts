import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  credentials = {
    userName: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  isShowLoginError: boolean=false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr :ChangeDetectorRef,
    private zone: NgZone
  ) {}

  onSubmit() {
   this.login();
  }
 login(){
 this.errorMessage = '';
    this.isLoading = true;
    this.isShowLoginError = false;
    this.authService.login(this.credentials.userName, this.credentials.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log("User "+response.body.user)
        console.log('Login successful, user role:', response.body.user.role);
        
        // Redirect based on user role
        if (response.body.user.role === 'ADMIN') {
          console.log('Admin user logged in, redirecting to admin dashboard');
          this.router.navigate(['/admin']);
        } else {
          console.log('Regular user logged in, redirecting to main page');
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.zone.run(() => {
        this.isLoading = false;
        console.log('Error:######', error);
        this.errorMessage = error.message || 'An error occurred during sign in';
        this.isShowLoginError = true;
        this.cdr.detectChanges();
        })
      }
    });
  
 }
  goBack() {
    this.router.navigate(['/']);
  }
}
