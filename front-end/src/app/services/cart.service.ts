import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartProductsSubject = new BehaviorSubject<any[]>([]);
  private paymentSelectionSubject = new BehaviorSubject<{ [productId: string]: boolean }>({});
  
  cartProducts$ = this.cartProductsSubject.asObservable();
  paymentSelection$ = this.paymentSelectionSubject.asObservable();

  get cartProducts() {
    return this.cartProductsSubject.value;
  }

  get paymentSelection() {
    return this.paymentSelectionSubject.value;
  }

  addToCart(product: any) {
    const existing = this.cartProducts.find((p: any) => p.id === product.id);
    if (existing) {
      if (existing.quantity < existing.stockQuantity) {
        existing.quantity++;
      }
    } else {
      this.cartProducts.push({ ...product, quantity: 1 });
    }
    this.cartProductsSubject.next([...this.cartProducts]);
  }

  removeFromCart(product: any) {
    const updated = this.cartProducts.filter((p: any) => p.id !== product.id);
    this.cartProductsSubject.next(updated);
    
    // Remove from payment selection if it exists
    const currentSelection = this.paymentSelection;
    delete currentSelection[product.id];
    this.paymentSelectionSubject.next({ ...currentSelection });
  }

  clearCart() {
    this.cartProductsSubject.next([]);
    this.paymentSelectionSubject.next({});
  }

  // Add product to cart and select it for payment (Buy Now functionality)
  addToCartAndSelect(product: any) {
    // First add to cart
    this.addToCart(product);
    
    // Then select only this product for payment, unselect all others
    const newSelection: { [productId: string]: boolean } = {};
    newSelection[product.id] = true;
    this.paymentSelectionSubject.next(newSelection);
  }

  // Toggle payment selection for a product
  togglePaymentSelection(productId: string, selected: boolean) {
    const currentSelection = this.paymentSelection;
    currentSelection[productId] = selected;
    this.paymentSelectionSubject.next({ ...currentSelection });
  }

  // Get selected products for payment
  getSelectedProducts() {
    return this.cartProducts.filter(p => this.paymentSelection[p.id]);
  }

  // Clear payment selection
  clearPaymentSelection() {
    this.paymentSelectionSubject.next({});
  }
} 