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
    if (this.cartItems().length === 0) 
      alert('Il tuo carrello è vuoto!');
      return;

    const confirmOrder = confirm("Sei sicuro di voler confermare l'ordine?");
    if (!confirmOrder) return;

    this.isLoading.set(true);

    try {
      await this.cartService.checkout();
      alert('Ordine completato con successo! Grazie per il tuo acquisto.');
      this.router.navigate(['/']); 
    } catch (error) {
      console.error('Errore durante il checkout:', error);
      alert('Si è verificato un errore durante l\'elaborazione dell\'ordine. Per favore, riprova più tardi.');
    } finally {
      this.isLoading.set(false);
    }
  }
}