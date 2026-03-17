import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  template: `<p>Cart works</p>`,
})
export class CartComponent {

  constructor(private cartService: CartService) {}

  // signal dal service
  // cartItems = this.cartService.cartItems;

  // totale calcolato
  // total = this.cartService.total;

  increase(productId: number) {
    this.cartService.increaseQuantity(productId);
  }

  decrease(productId: number) {
    this.cartService.decreaseQuantity(productId);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  checkout() {
    this.cartService.checkout();
  }
}