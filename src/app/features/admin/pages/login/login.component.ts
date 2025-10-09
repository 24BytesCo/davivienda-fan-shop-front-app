import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/** Pantalla de autenticación (login/registro rápido). */
@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  /** Correo y contraseña para inicio de sesión */
  email = '';
  password = '';
  loading = false;
  error: string | null = null;

  /** Campos de registro (API: fullName, email, password) */
  regFullName = '';
  regEmail = '';
  regPassword = '';
  remember = true;
  isRegister = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  /** Envía credenciales de inicio de sesión */
  submit(): void {
    this.loading = true;
    this.error = null;
    this.auth.authenticate$(this.email, this.password, this.remember).subscribe({
      next: () => {
        this.notify.toastSuccess('Bienvenido');
        const role = this.auth.getUser()?.role || '';
        const r = String(role).toLowerCase();
        if (r.includes('admin')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/usuario/dashboard']);
        }
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.notify.error('No se pudo iniciar sesion', this.error || undefined);
        this.loading = false;
      },
      complete: () => (this.loading = false)
    });
  }

  /** Envía datos para registro rápido */
  quickRegister(): void {
    // Validaciones mínimas según contrato de API
    if (!this.regFullName.trim()) {
      this.notify.warning('Ingresa tu nombre completo');
      return;
    }
    if (!this.regEmail.trim()) {
      this.notify.warning('Ingresa tu correo electronico');
      return;
    }
    if (!this.regPassword || this.regPassword.length < 8) {
      this.notify.warning('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.loading = true;
    this.error = null;
    this.auth
      .register$(
        {
          fullName: this.regFullName.trim(),
          email: this.regEmail.trim(),
          password: this.regPassword
        },
        this.remember
      )
      .subscribe({
        next: (token) => {
          if (token) {
            this.notify.toastSuccess('Cuenta creada');
            const role = this.auth.getUser()?.role || '';
            const r = String(role).toLowerCase();
            this.router.navigate([r.includes('admin') ? '/admin' : '/usuario/dashboard']);
          } else {
            // Si la API no devuelve token en el registro, iniciamos sesión con las credenciales ingresadas
            this.auth
              .authenticate$(this.regEmail.trim(), this.regPassword, this.remember)
              .subscribe({
                next: () => {
                  this.notify.toastSuccess('Cuenta creada');
                  const role = this.auth.getUser()?.role || '';
                  const r = String(role).toLowerCase();
                  this.router.navigate([r.includes('admin') ? '/admin' : '/usuario/dashboard']);
                },
                error: (err) => {
                  this.error = this.getErrorMessage(err);
                  this.notify.error('No se pudo iniciar sesión tras el registro', this.error || undefined);
                  this.loading = false;
                },
                complete: () => (this.loading = false)
              });
            return; // evita completar abajo, se maneja en el login
          }
        },
        error: (err) => {
          this.error = this.getErrorMessage(err);
          this.notify.error('No se pudo crear la cuenta', this.error || undefined);
          this.loading = false;
        },
        complete: () => (this.loading = false)
      });
  }

  /** Devuelve un mensaje de error de forma amigable */
  private getErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'No fue posible conectar con la API.';
    }
    if (err?.status === 409) {
      return 'El correo ya esta registrado.';
    }
    if (err?.error?.message) {
      return Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
    }
    if (typeof err?.message === 'string') return err.message;
    return 'No se pudo completar la accion. Verifica tus datos.';
  }
}
