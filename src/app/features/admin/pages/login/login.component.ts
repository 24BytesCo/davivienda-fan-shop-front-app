import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  // quick register fields
  regFirstName = '';
  regLastName = '';
  regEmail = '';
  regPassword = '';
  remember = true;
  isRegister = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  submit(): void {
    this.loading = true;
    this.error = null;
    this.auth.authenticate$(this.email, this.password, this.remember).subscribe({
      next: () => {
        this.notify.toastSuccess('Bienvenido');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.notify.error('No se pudo iniciar sesión', this.error || undefined);
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  quickRegister(): void {
    this.loading = true;
    this.error = null;
    this.auth
      .register$(
        {
          firstName: this.regFirstName,
          lastName: this.regLastName,
          email: this.regEmail,
          password: this.regPassword
        },
        this.remember
      )
      .subscribe({
        next: () => {
          this.notify.toastSuccess('Cuenta creada');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
          this.notify.error('No se pudo crear la cuenta', this.error || undefined);
          this.loading = false;
        },
        complete: () => (this.loading = false)
      });
  }

  private getErrorMessage(err: any): string {
    if (err?.error?.message) {
      return Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
    }
    if (typeof err?.message === 'string') return err.message;
    return 'No se pudo completar la acción. Verifica tus datos.';
  }
}
