import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ProductAddUpdate } from '../product-add-update/product-add-update';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductAddUpdate],
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

  showAddProductOverlay = false;

  showMenuIndex: number | null = null;

  selectedProduct: any = null;
  showViewProductOverlay: boolean = false;
  showEditProductOverlay: boolean = false;

  searchTerm: string = '';
  filteredProducts: any[] = [];

  showManageOrders = false;
  transactions: any[] = [];
  filteredTransactions: any[] = [];
  isLoadingTransactions = false;
  transactionsError = '';
  transactionSearchTerm: string = '';

  selectedTransaction: any = null;
  showTransactionOverlay: boolean = false;

  showManageUsers = false;
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoadingUsers = false;
  usersError = '';
  userSearchTerm: string = '';

  selectedUser: any = null;
  showUserOverlay: boolean = false;

  userOverlaySuccessMessage: string = '';
  userOverlayErrorMessage: string = '';

  userActiveChanged: boolean = false;
  initialUserActive: boolean = false;

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
    this.showManageProducts = true;
    this.showManageOrders = false;
    this.showManageUsers = false;
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
        this.filterProducts();
        this.isLoadingProducts = false;
        this.showManageProducts = true;
        this.cdr.detectChanges();
        console.log('is product loading After :',this.isLoadingProducts);
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
          return;
        }
        this.productsError = 'Failed to load products.';
        this.isLoadingProducts = false;
        this.cdr.detectChanges();
        console.error('Error fetching products:', err);
      }
    });
    this.isLoadingProducts = false;
  }

  onAdminSearchChange() {
    this.filterProducts();
  }

  filterProducts() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      (product.name && product.name.toLowerCase().includes(term)) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      (product.status && product.status.toLowerCase().includes(term)) ||
      (product.active !== undefined && (product.active ? 'active' : 'inactive').includes(term))
    );
  }

  onAddProduct() {
    this.showAddProductOverlay = true;
  }

  closeAddProductOverlay() {
    this.showAddProductOverlay = false;
  }

  onMenuClick(index: number) {
    this.showMenuIndex = this.showMenuIndex === index ? null : index;
  }

  onViewProduct(product: any) {
    this.selectedProduct = { ...product, status: product.status || (product.active ? 'Active' : 'Inactive') };
    this.showViewProductOverlay = true;
    this.showMenuIndex = null;
  }

  closeViewProductOverlay() {
    this.showViewProductOverlay = false;
    this.selectedProduct = null;
  }

  onEditProduct(product: any) {
    this.selectedProduct = { ...product, status: product.status || (product.active ? 'Active' : 'Inactive') };
    this.showEditProductOverlay = true;
    this.showMenuIndex = null;
  }

  closeEditProductOverlay() {
    this.showEditProductOverlay = false;
    this.selectedProduct = null;
  }

  onDeleteProduct(product: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const body: any = {
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      deleted: true,
      active: product.status ? product.status === 'Active' : !!product.active
    };
    this.http.put<any>(`${environment.apiUrl}/api/products/update/${product.id}`, body, { headers }).subscribe({
      next: () => {
        this.fetchProducts();
        this.showMenuIndex = null;
      },
      error: (err) => {
        alert('Failed to delete product.');
        this.showMenuIndex = null;
      }
    });
  }

  handleProductSaved() {
    this.showManageProducts = true;
    this.fetchProducts();
    this.closeAddProductOverlay();
    this.closeEditProductOverlay();
    this.closeViewProductOverlay && this.closeViewProductOverlay();
  }

  onManageOrders() {
    this.showManageOrders = true;
    this.showManageProducts = false;
    this.showManageUsers = false;
    this.fetchTransactions();
  }

  fetchTransactions() {
    this.isLoadingTransactions = true;
    this.transactionsError = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>(`${environment.apiUrl}/api/transactions`, { headers }).subscribe({
      next: (data) => {
        this.transactions = data;
        this.filterTransactions();
        this.isLoadingTransactions = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
          return;
        }
        this.transactionsError = 'Failed to load transactions.';
        this.isLoadingTransactions = false;
        this.cdr.detectChanges();
      }
    });
  }

  onTransactionSearchChange() {
    this.filterTransactions();
  }

  filterTransactions() {
    const term = this.transactionSearchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredTransactions = this.transactions;
      return;
    }
    this.filteredTransactions = this.transactions.filter(txn =>
      (txn.transactionId && txn.transactionId.toString().includes(term)) ||
      (txn.customerName && txn.customerName.toLowerCase().includes(term)) ||
      (txn.transactionDate && txn.transactionDate.toLowerCase().includes(term))
    );
  }

  onTransactionRowClick(txn: any) {
    console.log('clicked on '+JSON.stringify(txn.products))
    this.selectedTransaction = txn;
    this.showTransactionOverlay = true;
    this.cdr.detectChanges
  }

  closeTransactionOverlay() {
    this.showTransactionOverlay = false;
    this.selectedTransaction = null;
  }

  onManageUsers() {
    this.showManageUsers = true;
    this.showManageProducts = false;
    this.showManageOrders = false;
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoadingUsers = true;
    this.usersError = '';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    this.http.get<any[]>(`${environment.apiUrl}/api/users/active`, { headers }).subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers();
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
          return;
        }
        this.usersError = 'Failed to load users.';
        this.isLoadingUsers = false;
        this.cdr.detectChanges();
      }
    });
  }

  onUserSearchChange() {
    this.filterUsers();
  }

  filterUsers() {
    const term = this.userSearchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = this.users;
      return;
    }
    this.filteredUsers = this.users.filter(user =>
      (user.userId && user.userId.toString().includes(term)) ||
      (user.firstName && user.firstName.toLowerCase().includes(term)) ||
      (user.lastName && user.lastName.toLowerCase().includes(term)) ||
      (user.role && user.role.toLowerCase().includes(term))
    );
  }

  onUserRowClick(user: any) {
    this.selectedUser = { ...user };
    this.showUserOverlay = true;
    this.initialUserActive = user.active;
    this.userActiveChanged = false;
  }

  closeUserOverlay() {
    this.showUserOverlay = false;
    this.selectedUser = null;
  }

  onUserSave() {
    if (!this.userActiveChanged) return;
    this.updateUserActiveStatus(this.selectedUser.userId, this.selectedUser.active);
    this.cdr.detectChanges
  }

  updateUserActiveStatus(userId: any, active: boolean) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    const body = { userId, active };
    this.http.put<any>(`${environment.apiUrl}/api/users/update-active-status`, body, { headers }).subscribe({
      next: () => {
        this.userOverlaySuccessMessage = 'User status updated successfully!';
        this.userOverlayErrorMessage = '';
        this.fetchUsers();
        setTimeout(() => {
          this.userOverlaySuccessMessage = '';
          this.closeUserOverlay();
        }, 2000);
      },
      error: (err) => {
        this.userOverlayErrorMessage = 'Failed to update user status.';
        this.userOverlaySuccessMessage = '';
      }
    });
  }
}
