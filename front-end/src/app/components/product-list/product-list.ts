import { Component, OnInit, OnDestroy, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchService } from '../../services/search.service';
import { Subscription, timeout, catchError, of } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductList implements OnInit, OnDestroy {
  products: any[] = [];
  filteredProducts: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  private searchSubscription!: Subscription;
  private loadingTimeout: any;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Getter for debugging
  get isLoadingState(): boolean {
    return this.isLoading;
  }

  ngOnInit() {
    // Set up search subscription first
    this.searchSubscription = this.searchService.searchTerm$.subscribe(searchTerm => {
      this.filterProducts(searchTerm);
    });
    
    // Then load products
    this.loadProducts();
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  loadProducts() {
    
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Safety timeout to prevent infinite loading
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        
        this.isLoading = false;
        this.errorMessage = 'Request took too long. Please try again.';
        
        this.cdr.detectChanges();
      }
    }, 15000); // 15 seconds safety timeout

    this.http.get<any[]>(`${environment.apiUrl}/api/products/all`)
      .pipe(
        timeout(10000), // 10 second timeout
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            return of(null); // Network error
          }
          throw error;
        })
      )
      .subscribe({
        next: (data) => {
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
          }
          if (data === null) {
            
            this.errorMessage = 'Network error. Please check your connection and try again.';
            this.isLoading = false;
            
            this.cdr.detectChanges();
            return;
          }
          
          // Filter out products with stockQuantity 0 for REG_USER
          const user = this.authService.getCurrentUser();
          if (user && user.role === 'REG_USER') {
            this.products = data.filter(product => product.stockQuantity > 0);
          } else {
            this.products = data;
          }
          this.filteredProducts = [...this.products];
          this.isLoading = false;
          
          this.cdr.detectChanges();
          
          // Apply current search term after products are loaded
          const currentSearchTerm = this.searchService.getSearchTerm();
          if (currentSearchTerm) {
            this.filterProducts(currentSearchTerm);
          }
        },
        error: (error) => {
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
          }
          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Please try again.';
          } else {
            this.errorMessage = 'Failed to load products. Please try again later.';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
     
  }

  filterProducts(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.filteredProducts = [...this.products];
    } else {
      const term = searchTerm.toLowerCase().trim();
      this.filteredProducts = this.products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const matches = productName.includes(term);
        return matches;
      });
    }
  }

  onBuyNow(product: any) {
    // Add product to cart and select it for payment
    this.cartService.addToCartAndSelect(product);
    
    // Navigate to home page to show the cart overlay
    this.router.navigate(['/']);
    
    // Trigger cart overlay to open (this will be handled by the app component)
    // We'll use a custom event or service to communicate this
    this.triggerCartOverlay();
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }

  private triggerCartOverlay() {
    // Only dispatch custom event if we're in browser environment
    if (this.isBrowser) {
      // Dispatch a custom event to trigger cart overlay
      const event = new CustomEvent('openCartOverlay');
      window.dispatchEvent(event);
    }
  }
}
