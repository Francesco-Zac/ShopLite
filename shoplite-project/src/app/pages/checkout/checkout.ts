import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class CheckoutComponent implements OnInit {

  checkoutForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkoutForm = this.createForm();
  }

  createForm() {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.cartService.cartItems().length === 0) {
      alert('Carrello vuoto!');
      return;
    }

    if (this.checkoutForm.valid) {
      this.cartService.checkout(this.checkoutForm.value)
        .then(() => {
          this.cartService.clearCart();
          alert('Ordine inviato!');
          this.router.navigate(['/products']);
        })
        .catch(err => {
          console.error(err);
          alert('Errore durante il checkout');
        });
    }
  }
}
