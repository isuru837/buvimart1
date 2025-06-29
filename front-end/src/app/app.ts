import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UserMenu } from './components/user-menu/user-menu';
import { ShoppingCart } from './components/shopping-cart/shopping-cart';
import { ProductList } from './components/product-list/product-list';
import { LoginPopup } from './components/login-popup/login-popup';
import { AuthService } from './services/auth.service';
import { SearchService } from './services/search.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, UserMenu, ShoppingCart, LoginPopup, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected title = 'front-end';

  showCartOverlay = false;
  showLoginPopup = false;
  cartProducts: any[] = [];
  showTransactionSuccessPopup = false;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService
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
    // Subscribe to cart changes
    this.cartService.cartProducts$.subscribe(products => {
      this.cartProducts = products;
    });
  }

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
    console.log('App: Search input changed to:', target.value);
    this.searchService.setSearchTerm(target.value);
  }

  onContinueShopping() {
    this.showCartOverlay = false;
    this.router.navigate(['/']);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }

  onRemoveFromCart(product: any) {
    this.cartService.removeFromCart(product);
  }

  async onCompleteTransaction(products: any[]) {
    if (!products || products.length === 0) return;
    if (!this.authService.isLoggedIn()) {
      this.showCartOverlay = false;
      this.showLoginPopup = true;
      return;
    }
    const user = this.authService.getCurrentUser() || {};
    const transactionValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    const now = new Date();
    const requestBody = {
      transactionDate: now.toISOString(),
      transactionValue,
      customerId: user.userId || 1,
      customerName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'Guest',
      products: products.map(p => ({
        productId: p.id,
        priceAtTransaction: p.price,
        quantity: p.quantity,
        totalPrice: p.price * p.quantity
      }))
    };
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    try {
      await this.http.post(`${environment.apiUrl}/api/transactions/create`, requestBody, { headers }).toPromise();
      this.showCartOverlay = false;
      this.showTransactionSuccessPopup = true;
    } catch (err) {
      alert('Failed to complete transaction.');
      console.error(err);
    }
  }

  onLoginPopupLogin() {
    this.showLoginPopup = false;
  }

  onLoginPopupExit() {
    this.showLoginPopup = false;
  }

  onTransactionSuccessOk() {
    this.showTransactionSuccessPopup = false;
    this.cartService.clearCart();
  }
}
