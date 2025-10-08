import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

/** Barra de navegación del panel de administración. */
@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {

  nombreUsuario: string = '';
  rolUsuario: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {
    // Consultando los datos del usuario
    var user = this.auth.getUser();
    console.log('Usuario autenticado:', user);
    this.nombreUsuario = user?.fullName || '';
    this.rolUsuario = user?.role || ''; 
  }

  /** Indica si hay sesión autenticada */
  get loggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  /** Cierra sesión y redirige a login de admin */
  logout(): void {
    this.auth.logout();
    this.notify.toastSuccess('Sesión cerrada');
    this.router.navigate(['/admin/login']);
  }
}

