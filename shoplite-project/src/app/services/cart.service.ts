import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, Product } from '../models/product-model/product-model'; 

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private _cartItems = signal<CartItem[]>(this.getInitialCart());

  cartItems = this._cartItems.asReadonly();

  // totale corretto con qty
  total = computed(() =>
    this._cartItems().reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    )
  );
  constructor() {
  effect(() => {
    localStorage.setItem('cart', JSON.stringify(this._cartItems()));
  });
}

  private getInitialCart(): CartItem[] {
    const saved = localStorage.getItem('cart');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return []; 
    }
  }

  // aggiungere prodotto
  addToCart(product: Product) {
    this._cartItems.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      return existing 
        ? items.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...items, { product, qty: 1 }];
    });
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

  return fetch('http://localhost:3000/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(order)
  })
    .then(res => {
      if (!res.ok) throw new Error('Error en el pago');
      return res.json();
    })
    .then(data => {
      this._cartItems.set([]); 
      return data;
    })
    .catch(err => {
      console.error('Checkout error:', err);
      throw err; 
    });
}

clearCart() {
  this._cartItems.set([]);
}


}