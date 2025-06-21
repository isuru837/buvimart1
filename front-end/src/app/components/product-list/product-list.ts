import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchService } from '../../services/search.service';
import { Subscription, timeout, catchError, of } from 'rxjs';

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
    private cdr: ChangeDetectorRef
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
    console.log('Loading products...');
    console.log('API URL:', `${environment.apiUrl}/api/products/all`);
    console.log('Setting isLoading to true');
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    // Safety timeout to prevent infinite loading
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        console.log('Safety timeout triggered - resetting loading state');
        this.isLoading = false;
        this.errorMessage = 'Request took too long. Please try again.';
        console.log('isLoading set to false due to timeout');
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
            console.log('Network error detected');
            this.errorMessage = 'Network error. Please check your connection and try again.';
            this.isLoading = false;
            console.log('isLoading set to false due to network error');
            this.cdr.detectChanges();
            return;
          }
          console.log('Products loaded successfully:', data);
          this.products = data;
          this.filteredProducts = data;
          this.isLoading = false;
          console.log('isLoading set to false after successful load');
          this.cdr.detectChanges();
          
          // Apply current search term after products are loaded
          const currentSearchTerm = this.searchService.getSearchTerm();
          console.log('Current search term after loading:', currentSearchTerm);
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
          console.log('isLoading set to false due to error');
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
}
