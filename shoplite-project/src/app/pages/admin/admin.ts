import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html'
})
export class AdminComponent {

  // prodotto (interfaccia semplice)
  product = {
    name: '',
    price: 0,
    description: '',
    quantity: 0
  };

  // lista prodotti (mock locale)
  products: any[] = [];

  // submit form
  onSubmit(form: NgForm) {
    if (form.valid) {

      // aggiungo prodotto alla lista (simulazione)
      this.products.push({ ...this.product });

      console.log('Product saved:', this.product);

      // reset form
      form.resetForm();

    }
  }
}