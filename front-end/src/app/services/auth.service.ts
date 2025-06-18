import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

interface LoginResponse {
  user: {
    userId: number;
    userName: string;
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    email: string;
    mobile: string;
    deleted: boolean;
    role: string;
  };
  token: {
    jwToken: string;
    refreshToken: string | null;
  };
  loginTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const userData = localStorage.getItem('user');
      console.log('Initial user data from localStorage:', userData);
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user data:', parsedUser);
        this.userSubject.next(parsedUser);
      }
    }
  }

  login(userName: string, password: string): Observable<any> {
    console.log('Attempting login with:', { userName });
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      userName: userName,
      password: password
    };
    console.log('Login request body:', body);

    const loginUrl = `${this.apiUrl}/api/auth/login`;
    console.log('Login URL:', loginUrl);

    return this.http.post<LoginResponse>(loginUrl, body, { 
      headers,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (this.isBrowser && response.body?.token?.jwToken) {
          // Store the JWT token
          localStorage.setItem('token', response.body.token.jwToken);
          
          // Store user data
          const userData = response.body.user;
          console.log('Storing user data:', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          this.userSubject.next(userData);
          console.log('Current user subject value:', this.userSubject.value);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Login error details:', {
      status: error.status,
      statusText: error.statusText,
      error: error.error,
      headers: error.headers,
      url: error.url
    });

    let errorMessage = 'An error occurred during login';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        // If the server returns an error object with a message
        errorMessage = error.error.message || error.error.error || 'Server error occurred';
      } else if (error.error && typeof error.error === 'string') {
        // If the server returns a string error
        errorMessage = error.error;
      } else {
        // Default error messages based on status code
        switch (error.status) {
          case 403:
            errorMessage = 'Access denied. Please check your credentials.';
            break;
          case 401:
            errorMessage = 'Invalid username or password.';
            break;
          case 404:
            errorMessage = 'Login service not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
    }
    
    // Return an error object that can be easily displayed to the user
    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      originalError: error
    }));
  }

  setUser(user: any) {
    console.log('Setting user:', user);
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
    console.log('Current user subject value after setUser:', this.userSubject.value);
  }

  logout() {
    console.log('Logging out user');
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
    console.log('Current user subject value after logout:', this.userSubject.value);
  }

  isLoggedIn(): boolean {
    const isLoggedIn = !!this.userSubject.value;
    console.log('isLoggedIn check:', isLoggedIn, 'Current user:', this.userSubject.value);
    return isLoggedIn;
  }

  updateUser(userData: any): Observable<any> {
    console.log('Updating user data:', userData);
    
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    console.log('Using token for update:', token ? 'Token exists' : 'No token');
    console.log('Using token is:', token);
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const updatedUserData = {
      ...userData,
      deleted: false
    };

    console.log('Sending update request with data:', updatedUserData);

    return this.http.put(`${this.apiUrl}/api/users/update`, updatedUserData, { headers }).pipe(
      tap(updatedUser => {
        console.log('Update response:', updatedUser);
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userSubject.next(updatedUser);
          console.log('User data updated in localStorage and subject');
        }
      }),
      catchError(error => {
        console.error('Update error:', error);
        let errorMessage = 'Failed to update profile';
        
        if (error.error && typeof error.error === 'object') {
          errorMessage = error.error.message || error.error.error || errorMessage;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        }
        
        return throwError(() => ({
          message: errorMessage,
          status: error.status,
          originalError: error
        }));
      })
    );
  }
} 