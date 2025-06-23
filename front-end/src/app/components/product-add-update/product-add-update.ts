import { ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-add-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-add-update.html',
  styleUrl: './product-add-update.css'
})
export class ProductAddUpdate {
  @Input() product: any = {
    name: '',
    description: '',
    price: null,
    stockQuantity: null,
    delete: false,
    status: 'Active',
  };

  @Input() isEditMode: boolean = false;

  @Output() exit = new EventEmitter<void>();
  @Output() productSaved = new EventEmitter<void>();

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  validateProduct() {
    if (!this.product.name || !this.product.description || this.product.price == null || this.product.stockQuantity == null) {
      this.errorMessage = 'All fields are required.';
      return false;
    }
    if (this.product.price < 0) {
      this.errorMessage = 'Price must be non-negative.';
      return false;
    }
    if (this.product.stockQuantity < 0) {
      this.errorMessage = 'Stock Quantity must be non-negative.';
      return false;
    }
    return true;
  }

  onSave() {
    this.errorMessage = '';
    this.successMessage = '';
    if (!this.validateProduct()) {
      return;
    }
    this.isLoading = true;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const body: any = {
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      stockQuantity: this.product.stockQuantity
    };
    if (this.isEditMode && this.product.id) {
      // Edit mode: add 'delete' and 'active' fields
      body.delete = this.product.delete;
      body.active = this.product.status === 'Active';
      this.http.put<any>(`${environment.apiUrl}/api/products/update/${this.product.id}`, body, { headers }).subscribe({
        next: (res) => {
          this.successMessage = 'Product updated successfully!';
          this.isLoading = false;
          this.errorMessage = '';
          this.productSaved.emit();
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 401) {
            this.exit.emit();
            return;
          }
          this.errorMessage = err?.error?.message || 'Failed to update product.';
          this.isLoading = false;
        }
      });
    } else {
      // Add mode: POST add
      this.http.post<any>(`${environment.apiUrl}/api/products/add`, body, { headers }).subscribe({
        next: (res) => {
          this.successMessage = 'Product added successfully!';
          this.isLoading = false;
          // Reset each property individually
          this.product.name = '';
          this.product.description = '';
          this.product.price = null;
          this.product.stockQuantity = null;
          this.product.delete = false;
          if (!this.isEditMode) {
            this.product.status = 'Active';
          }
          this.errorMessage = '';
          this.productSaved.emit();
          setTimeout(() => {
            this.successMessage = '';
          }, 2000);
          this.cdr.detectChanges();
        },
        error: (err) => {
          if (err.status === 401) {
            this.exit.emit();
            return;
          }
          this.errorMessage = err?.error?.message || 'Failed to add product.';
          this.isLoading = false;
        }
      });
    }
  }

  onExit() {
    this.exit.emit();
  }

  onClear() {
    // Reset fields except status (if in edit mode, keep status)
    this.product = {
      name: '',
      description: '',
      price: null,
      stockQuantity: null,
      delete: false,
      status: this.isEditMode ? this.product.status : 'Active',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
