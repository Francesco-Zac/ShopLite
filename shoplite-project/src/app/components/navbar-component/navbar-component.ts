import { Component, inject } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  router = inject(Router);

  ngOnInit(): void {
    this.auth.checkSession();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
