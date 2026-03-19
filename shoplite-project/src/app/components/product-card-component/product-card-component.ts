import { CurrencyPipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Product } from '../../models/product-model/product-model';
import { OutOfStockDirective } from '../../directives/out-of-stock-directive';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-product-card-component',
  imports: [RouterLink, OutOfStockDirective, CurrencyPipe],
  templateUrl: './product-card-component.html',
  styleUrl: './product-card-component.css',
})
export class ProductCardComponent {
  product = input.required<Product>();
  addToCart = output<Product>();

  onAdd(): void {
    if (this.product().quantity <= 0) {
      return;
    }

    this.addToCart.emit(this.product());
  }
}
