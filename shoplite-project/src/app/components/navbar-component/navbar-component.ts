import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
})
export class NavbarComponent {
  auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.checkSession();
  }

  logout(): void {
    this.auth.logout();
  }
}
