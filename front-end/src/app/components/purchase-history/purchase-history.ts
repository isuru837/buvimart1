import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchase-history.html',
  styleUrl: './purchase-history.css'
})
export class PurchaseHistory implements OnInit {
  transactions: any[] = [];
  isLoading = false;
  errorMessage = '';
  showTransactionOverlay = false;
  selectedTransaction: any = null;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private dcr:ChangeDetectorRef,
    private zone:NgZone
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/sign-in']);
        return;
      }
      this.loadPurchaseHistory();
    });
  }

  loadPurchaseHistory() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.errorMessage = 'User not found. Please sign in again.';
      this.isLoading = false;
      return;
    }

    this.http.get<any[]>(`${environment.apiUrl}/api/transactions/customer/${currentUser.userId}`, { headers }).subscribe({
      next: (data) => {
        this.zone.run(()=>{
          this.transactions = data;
          this.isLoading = false;
          this.dcr.detectChanges();
        })
        
      },
      error: (err) => {
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/sign-in']);
          return;
        }
        this.errorMessage = 'Failed to load purchase history. Please try again.';
        this.isLoading = false;
        console.error('Error fetching purchase history:', err);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewTransactionDetails(transaction: any) {
    this.selectedTransaction = transaction;
    this.showTransactionOverlay = true;
  }

  closeTransactionOverlay() {
    this.showTransactionOverlay = false;
    this.selectedTransaction = null;
  }
} 