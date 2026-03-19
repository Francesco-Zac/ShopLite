import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list-component/product-list-component';
import { CartComponent } from './components/cart.component/cart.component';
import { LoginComponent } from './pages/login-component/login-component';
import { CheckoutComponent } from './pages/checkout/checkout';
import { AdminComponent } from './pages/admin/admin';
import { ProductDetailComponent } from './components/product-detail-component/product-detail-component';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', canActivate: [adminGuard], component: AdminComponent}
];
