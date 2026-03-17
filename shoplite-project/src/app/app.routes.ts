import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list-component/product-list-component';
//import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
 // { path: 'product/:id', component: ProductDetailComponent },
 // { path: 'cart', component: CartComponent },
 // { path: 'checkout', component: CheckoutComponent },
 // { path: 'admin', loadComponent: () => import('./components/admin-product-form/admin-product-form.component').then(m => m.AdminProductFormComponent), canActivate: [AdminGuard] }
];
