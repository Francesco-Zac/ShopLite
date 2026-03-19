import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../models/product-model/product-model';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart.service';
import { OutOfStockDirective } from '../../directives/out-of-stock-directive';

@Component({
  selector: 'app-product-detail-component',
  imports: [RouterLink, OutOfStockDirective, CurrencyPipe],
  templateUrl: './product-detail-component.html',
  styleUrl: './product-detail-component.css',
})

export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productSvc = inject(ProductService);
  private cartSvc = inject(CartService);

  product = signal<Product | null>(null);
  loading = signal(true);
  added = signal(false);

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const p = await this.productSvc.getById(id);
    this.product.set(p);
    this.loading.set(false);
  }

  addToCart(): void {
    if (this.product() && this.product()!.quantity > 0) {
      this.cartSvc.addToCart(this.product()!);
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2500);
    }
  }
}
