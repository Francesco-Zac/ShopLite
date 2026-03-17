import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _isAdmin = signal(false);
  readonly isAdmin = this._isAdmin.asReadonly();

  private _token = signal<string | null>(null);

  async login(username: string, password: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const { token } = await res.json();
      this._token.set(token);
      this._isAdmin.set(true);
      localStorage.setItem('auth_token', token);
      return true;
    } catch (err) {
      console.error('Errore login:', err);
      return false;
    }
  }

  logout(): void {
    this._token.set(null);
    this._isAdmin.set(false);
    localStorage.removeItem('auth_token');
  }

  async checkSession(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      const res = await fetch(`${this.apiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        this._token.set(token);
        this._isAdmin.set(true);
      } else {
        this.logout();
      }
    } catch {
      this.logout();
    }
  }

  getToken(): string | null {
    // Prima legge dal signal in memoria, poi dal localStorage come fallback
    return this._token() ?? localStorage.getItem('auth_token');
  }
}
