import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  currentUser: any;
  stats = {
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  };

  showManageProducts = false;
  products: any[] = [];
  isLoadingProducts = false;
  productsError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
      if (!user) {
        this.router.navigate(['/sign-in']);
        return;
      }
      
      if (user.role !== 'ADMIN') {
        this.router.navigate(['/']);
        return;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onManageProducts() {
    this.fetchProducts();
  }

  fetchProducts() {
    this.isLoadingProducts = true;
    this.productsError = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    // LOGGING
     console.log('is product loading Before :',this.isLoadingProducts);
    this.http.get<any[]>(`${environment.apiUrl}/api/products/all-admin`, { headers }).subscribe({
      next: (data) => {
        this.products = data;
        this.isLoadingProducts = false;
        this.showManageProducts = true;
        this.cdr.detectChanges();
        console.log('is product loading After :',this.isLoadingProducts);
      },
      error: (err) => {
        this.productsError = 'Failed to load products.';
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
        console.error('Error fetching products:', err);
      }
    });
    this.isLoadingProducts = false;
  }
}
