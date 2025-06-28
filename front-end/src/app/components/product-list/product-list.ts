import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchService } from '../../services/search.service';
import { Subscription, timeout, catchError, of } from 'rxjs';
import { CartService } from '../../services/cart.service';

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

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService
  ) {}

  // Getter for debugging
  get isLoadingState(): boolean {
    console.log('Template checking isLoading:', this.isLoading);
    return this.isLoading;
  }

  ngOnInit() {
    console.log('ProductList component initialized');
    console.log('Initial isLoading state:', this.isLoading);
    
    // Set up search subscription first
    this.searchSubscription = this.searchService.searchTerm$.subscribe(searchTerm => {
      console.log('Search term changed:', searchTerm);
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
          console.error('HTTP Error:', error);
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
          
          this.products = data;
          this.filteredProducts = data;
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
          console.error('Error fetching products:', error);
          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Please try again.';
          } else {
            this.errorMessage = 'Failed to load products. Please try again later.';
          }
          this.isLoading = false;
          console.log('Calling detectChanges');
          this.cdr.detectChanges();
        }
      });
     
  }

  filterProducts(searchTerm: string) {
    console.log('Filtering products with search term:', searchTerm);
    console.log('Current products:', this.products);
    
    if (!searchTerm.trim()) {
      console.log('Empty search term - showing all products');
      this.filteredProducts = [...this.products];
    } else {
      const term = searchTerm.toLowerCase().trim();
      console.log('Searching for term:', term);
      this.filteredProducts = this.products.filter(product => {
        const productName = product.name ? product.name.toLowerCase() : '';
        const matches = productName.includes(term);
        console.log(`Product: ${product.name}, matches: ${matches}`);
        return matches;
      });
      console.log('Filtered products:', this.filteredProducts);
    }
  }

  onBuyNow(product: any) {
    // TODO: Implement buy now logic
    console.log('Buy Now clicked for product:', product);
  }

  onAddToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
