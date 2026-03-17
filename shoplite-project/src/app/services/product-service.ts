import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../models/product-model/product-model';
import { AuthService } from './auth-service';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private auth = inject(AuthService);

  private _products = signal<Product[]>([]);
  readonly products = this._products.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  private authHeaders(): HeadersInit {
    const token = this.auth.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async loadAll(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const res = await fetch(this.apiUrl);
      if (!res.ok) throw new Error(`Errore HTTP ${res.status}`);
      const data: Product[] = await res.json();
      this._products.set(data);
    } catch (e) {
      this._error.set('Impossibile caricare i prodotti. Verifica che il backend sia attivo.');
      console.error(e);
    } finally {
      this._loading.set(false);
    }
  }

  async getById(id: number): Promise<Product | null> {
    try {
      const res = await fetch(`${this.apiUrl}/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async create(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? `Errore HTTP ${res.status}`);
    }
    const created: Product = await res.json();
    this._products.update(list => [...list, created]);
    return created;
  }

  async update(id: number, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify(product),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? `Errore HTTP ${res.status}`);
    }
    const updated: Product = await res.json();
    this._products.update(list => list.map(p => (p.id === id ? updated : p)));
    return updated;
  }

  async delete(id: number): Promise<void> {
    const res = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Errore HTTP ${res.status}`);
    }
    this._products.update(list => list.filter(p => p.id !== id));
  }
}
