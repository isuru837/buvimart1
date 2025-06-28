import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartProductsSubject = new BehaviorSubject<any[]>([]);
  cartProducts$ = this.cartProductsSubject.asObservable();

  get cartProducts() {
    return this.cartProductsSubject.value;
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
  }

  clearCart() {
    this.cartProductsSubject.next([]);
  }
} 