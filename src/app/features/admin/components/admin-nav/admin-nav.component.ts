import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-nav',
  templateUrl: 'admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent implements OnInit, OnDestroy {
  route = '';
  nombreUsuario = '';
  rolUsuario = '';
  showConfigMenu = false;
  sidebarCollapsed = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService,
  ) {
    const user = this.auth.getUser();
    this.nombreUsuario = user?.fullName || '';
    this.rolUsuario = user?.role || '';
    this.route = this.router.url;
  }

  /** Inicializa clases del layout admin. */
  ngOnInit(): void { this.applyBodyOffset(); }
  /** Limpia clases del layout al destruir el componente. */
  ngOnDestroy(): void {
    document.body.classList.remove('admin-has-sidenav');
    document.body.classList.remove('admin-sidenav-collapsed');
  }

  get loggedIn(): boolean { return this.auth.isAuthenticated(); }

  /** Cierra sesión y redirige al login de administración. */
  logout(): void {
    this.auth.logout();
    this.notify.toastSuccess('Sesión cerrada');
    this.router.navigate(['/admin/login']);
  }

  openConfigMenu(): void { this.showConfigMenu = true; }
  onConfigMenuChange(v: boolean): void { this.showConfigMenu = v; }
  toggleCollapse(): void { this.sidebarCollapsed = !this.sidebarCollapsed; this.applyBodyOffset(); }

  /** Aplica clases al body según estado del sidebar. */
  private applyBodyOffset(): void {
    document.body.classList.add('admin-has-sidenav');
    if (this.sidebarCollapsed) document.body.classList.add('admin-sidenav-collapsed');
    else document.body.classList.remove('admin-sidenav-collapsed');
  }

  get isAdmin(): boolean {
    const r = String(this.rolUsuario || '').toLowerCase();
    return r.includes('admin');
  }
}
