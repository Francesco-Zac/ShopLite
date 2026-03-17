import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})

export class LoginComponent {
   private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  error = signal(false);
  showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  async onLogin(): Promise<void> {
    const ok = await this.auth.login(this.username, this.password);
    if (ok) {
      this.router.navigate(['/admin']);
    } else {
      this.error.set(true);
    }
  }
}

