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
  editingProductId: number | null = null;

  product = this.createEmptyProduct();

  async ngOnInit(): Promise<void> {
    await this.productService.loadAll();
  }

  async onSubmit(form: NgForm) {
    if (!form.valid) return;

    try {
      const payload = {
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        quantity: this.product.quantity,
        imageUrl: this.product.imageUrl || '',
        category: this.product.category || '',
      };

      if (this.editingProductId !== null) {
        await this.productService.update(this.editingProductId, payload);
        alert('Prodotto aggiornato con successo!');
      } else {
        await this.productService.create(payload);
        alert('Prodotto creato con successo!');
      }

      this.resetForm(form);
    } catch (err: any) {
      console.error('Errore nel salvataggio prodotto:', err);
      const message = err?.message || 'Impossibile salvare il prodotto';
      alert(`Impossibile salvare il prodotto, riprova. (${message})`);
    }
  }

  startEdit(product: Product): void {
    this.editingProductId = product.id;
    this.product = {
      name: product.name,
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      imageUrl: product.imageUrl,
      category: product.category,
    };
  }

  async removeProduct(id: number): Promise<void> {
    if (!confirm('Sei sicuro di eliminare questo prodotto?')) return;

    try {
      await this.productService.delete(id);
      if (this.editingProductId === id) {
        this.resetForm();
      }
    } catch (err) {
      console.error('Errore eliminazione prodotto:', err);
      alert('Errore eliminazione prodotto');
    }
  }

  cancelEdit(form?: NgForm): void {
    this.resetForm(form);
  }

  private resetForm(form?: NgForm): void {
    this.editingProductId = null;
    this.product = this.createEmptyProduct();
    form?.resetForm(this.product);
  }

  private createEmptyProduct() {
    return {
      name: '',
      price: 0,
      description: '',
      quantity: 1,
      imageUrl: '',
      category: '',
    };
  }
}
