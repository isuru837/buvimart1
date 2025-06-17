import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';

interface LoginResponse {
  token: string;
  user: any;
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
      if (userData) {
        this.userSubject.next(JSON.parse(userData));
      }
    }
  }

  login(userName: string, password: string): Observable<any> {
    console.log('Attempting login with:', { userName });
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    // Ensure the request body matches the server's expected format
    const body = {
      username: userName,  // Changed from userName to username to match server expectation
      password: password
    };
    console.log('Login request body:', body);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, body, { 
      headers,
      observe: 'response'
    }).pipe(
      tap(response => {
        console.log('Login response:', response);
        if (this.isBrowser && response.body?.token) {
          localStorage.setItem('token', response.body.token);
          localStorage.setItem('user', JSON.stringify(response.body.user));
          this.userSubject.next(response.body.user);
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
      
      // Add specific error messages for common status codes
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
      }
    }
    
    return throwError(() => ({
      message: errorMessage,
      originalError: error
    }));
  }

  setUser(user: any) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.userSubject.next(user);
  }

  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }

  updateUser(userData: any): Observable<any> {
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Ensure the deleted field is included
    const updatedUserData = {
      ...userData,
      deleted: false
    };

    // Using the exact endpoint as specified
    return this.http.put(`${this.apiUrl}/users/update/1`, updatedUserData, { headers }).pipe(
      tap(updatedUser => {
        if (this.isBrowser) {
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.userSubject.next(updatedUser);
        }
      })
    );
  }
} 