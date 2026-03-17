import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product-model/product-model'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cartItems = signal<CartItem[]>([]);

  cartItems = this._cartItems.asReadonly();

  // totale corretto con qty
  total = computed(() =>
    this._cartItems().reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    )
  );

  // aggiungere prodotto
  addToCart(product: Product) {
    const items = this._cartItems();

    const existing = items.find(i => i.product.id === product.id);

    if (existing) {
      this.increaseQuantity(product.id);
    } else {
      this._cartItems.set([
        ...items,
        { product, qty: 1 }
      ]);
    }
  }

  // aumentare quantità
  increaseQuantity(productId: number) {
    const updated = this._cartItems().map(item =>
      item.product.id === productId
        ? { ...item, qty: item.qty + 1 }
        : item
    );

    this._cartItems.set(updated);
  }

  // diminuire quantità
  decreaseQuantity(productId: number) {
    const updated = this._cartItems()
      .map(item =>
        item.product.id === productId
          ? { ...item, qty: item.qty - 1 }
          : item
      )
      .filter(item => item.qty > 0);

    this._cartItems.set(updated);
  }

  // rimuovere
  removeFromCart(productId: number) {
    const updated = this._cartItems().filter(
      item => item.product.id !== productId
    );

    this._cartItems.set(updated);
  }

  // checkout
  checkout() {
    const order = {
      items: this._cartItems(),
      total: this.total()
    };

    console.log('Ordine inviato:', order);
     
    alert('Ordine completato!');

    // TODO: POST /orders

    this._cartItems.set([]);
  }
}