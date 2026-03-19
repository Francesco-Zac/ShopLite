import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { Product } from '../../models/product-model/product-model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
})
export class AdminComponent implements OnInit {
  private productService = inject(ProductService);

  products = this.productService.products;

  product = {
    name: '',
    price: 0,
    description: '',
    quantity: 1,
    imageUrl: '',
    category: '',
  };

  async ngOnInit(): Promise<void> {
    await this.productService.loadAll();
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    try {
      await this.productService.create({
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        quantity: this.product.quantity,
        imageUrl: this.product.imageUrl || '',
        category: this.product.category || '',
      });

      alert('Prodotto creato con successo!');
      form.resetForm({ quantity: 1 });
    } catch (err: any) {
      console.error('Errore nel salvataggio prodotto:', err);
      const message = err?.message || 'Impossibile salvare il prodotto';
      alert(`Impossibile salvare il prodotto, riprova. (${message})`);
    }
  }

  async adjustStock(product: Product, delta: number): Promise<void> {
    const newQty = product.quantity + delta;
    if (newQty < 0) return;

    try {
      await this.productService.update(product.id, { quantity: newQty });
      await this.productService.loadAll();
    } catch (err) {
      console.error('Errore aggiornamento stock:', err);
      alert('Errore aggiornamento stock');
    }
  }

  async removeProduct(id: number): Promise<void> {
    if (!confirm('Sei sicuro di eliminare questo prodotto?')) return;

    try {
      await this.productService.delete(id);
      await this.productService.loadAll();
    } catch (err) {
      console.error('Errore eliminazione prodotto:', err);
      alert('Errore eliminazione prodotto');
    }
  }
}
