import { ChangeDetectorRef, Component, NgZone, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { UserMenu } from './components/user-menu/user-menu';
import { ShoppingCart } from './components/shopping-cart/shopping-cart';
import { ProductList } from './components/product-list/product-list';
import { LoginPopup } from './components/login-popup/login-popup';
import { AuthService } from './services/auth.service';
import { SearchService } from './services/search.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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
export class App implements OnInit, OnDestroy {
  protected title = 'front-end';

  showCartOverlay = false;
  showLoginPopup = false;
  cartProducts: any[] = [];
  showTransactionSuccessPopup = false;
  private isBrowser: boolean;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    // Subscribe to user changes to handle role-based routing
    this.authService.user$.subscribe(user => {
      if (user) {
        if (user.role === 'ADMIN') {
          // If admin user is on the main page, redirect to admin dashboard
          if (this.router.url === '/') {
            this.router.navigate(['/admin']);
          }
        } else {
          // If regular user is on admin page, redirect to main page
          if (this.router.url === '/admin') {
            this.router.navigate(['/']);
          }
        }
      }
    });
    // Subscribe to cart changes
    this.cartService.cartProducts$.subscribe(products => {
      this.cartProducts = products;
    });

    // Listen for custom event to open cart overlay (Buy Now functionality)
    // Only add event listener if we're in browser environment
    if (this.isBrowser) {
      window.addEventListener('openCartOverlay', this.openCartOverlayHandler);
    }
  }

  ngOnDestroy() {
    // Clean up event listener only if we're in browser environment
    if (this.isBrowser) {
      window.removeEventListener('openCartOverlay', this.openCartOverlayHandler);
    }
  }

  private openCartOverlayHandler = () => {
    this.showCartOverlay = true;
    this.cdr.detectChanges();
  };

  onSearchChange(event: Event) {
    const target = event.target as HTMLInputElement;
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
      this.zone.run(()=>{
        this.showCartOverlay = false;
        this.showTransactionSuccessPopup = true;
        this.cdr.detectChanges();
      })
      
    } catch (err) {
      alert('Failed to complete transaction.');
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
