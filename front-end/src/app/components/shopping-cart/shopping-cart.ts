import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit, OnDestroy {
  @Input() cartProducts: any[] = [];
  @Output() cartChanged = new EventEmitter<any[]>();
  @Output() paymentSelectionChanged = new EventEmitter<any[]>();
  @Output() continueShopping = new EventEmitter<void>();
  @Output() removeFromCart = new EventEmitter<any>();
  @Output() completeTransaction = new EventEmitter<any>();

  // Track which products are selected for payment
  paymentSelection: { [productId: string]: boolean } = {};
  private paymentSelectionSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Subscribe to payment selection changes from CartService
    this.paymentSelectionSubscription = this.cartService.paymentSelection$.subscribe(selection => {
      this.paymentSelection = selection;
    });
  }

  ngOnDestroy() {
    if (this.paymentSelectionSubscription) {
      this.paymentSelectionSubscription.unsubscribe();
    }
  }

  get paymentBucket() {
    return this.cartProducts.filter(p => this.paymentSelection[p.id]);
  }

  get paymentSubtotal() {
    return this.paymentBucket.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  }

  increaseQuantity(product: any) {
    if (product.quantity < product.stockQuantity) {
      product.quantity++;
      this.cartChanged.emit(this.cartProducts);
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
      this.cartChanged.emit(this.cartProducts);
    }
  }

  removeProduct(product: any) {
    this.removeFromCart.emit(product);
    // CartService will handle removing from payment selection
  }

  togglePaymentSelection(product: any, event: any) {
    this.cartService.togglePaymentSelection(product.id, event.target.checked);
    this.paymentSelectionChanged.emit(this.paymentBucket);
  }

  onContinueShopping() {
    this.continueShopping.emit();
  }

  onCompleteTransaction() {
    this.completeTransaction.emit(this.paymentBucket);
  }
}
