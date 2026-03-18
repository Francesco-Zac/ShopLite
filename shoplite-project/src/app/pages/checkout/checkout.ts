import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.html'
})
export class CheckoutComponent {

  checkoutForm = this.createForm();

constructor(private fb: FormBuilder, private cartService: CartService) {}

createForm() {
  return this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['', Validators.required],
  });
}
  onSubmit() {
    if (this.checkoutForm.valid) {

      const order = {
        items: this.cartService.cartItems(),
        total: this.cartService.total(),
        shipping: this.checkoutForm.value
      };

      console.log(order);

      this.cartService.checkout(); 

      alert('Ordine inviato!');
    }
  }
}