import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product-service';
import { CartService } from '../../services/cart-service';
import { Product } from '../../models/product-model/product-model';
import { ProductCardComponent } from "../product-card-component/product-card-component";


@Component({
  selector: 'app-product-list-component',
  imports: [ProductCardComponent],
  templateUrl: './product-list-component.html',
  styleUrl: './product-list-component.css',
})
export class ProductListComponent {

productSvc = inject(ProductService);
  private cartSvc = inject(CartService);

  async ngOnInit(): Promise<void> {
    await this.productSvc.loadAll();
  }

  onAddToCart(product: Product): void {
    this.cartSvc.addToCart(product);
  }

}

