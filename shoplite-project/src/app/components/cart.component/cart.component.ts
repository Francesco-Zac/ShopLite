import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  private router = inject(Router);
  private cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  total = this.cartService.total;

  isLoading = signal(false);

  increase(productId: number) {
    this.cartService.increaseQuantity(productId);
  }

  decrease(productId: number) {
    this.cartService.decreaseQuantity(productId);
  }

  remove(productId: number) {
    this.cartService.removeFromCart(productId);
  }

 async checkout() {
  if (this.cartItems().length === 0) {
    alert('Il tuo carrello è vuoto!');
    return;
  }

  const confirmOrder = confirm("Sei sicuro di voler continuare?");
  if (!confirmOrder) return;

  this.router.navigate(['/checkout']);
}
}
