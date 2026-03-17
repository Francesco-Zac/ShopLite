import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product-model/product-model';

@Injectable({ providedIn: 'root' })
export class CartService {

  private _items = signal<Product[]>([]);
  items = this._items.asReadonly();

  add(product: Product) {
    this._items.update(items => [...items, product]);
  }

  checkout() {
    fetch('http://localhost:3000/orders', {
      method: 'POST',
      body: JSON.stringify(this._items()),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
