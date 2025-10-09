import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  private isAdminRole(role?: string | null): boolean {
    if (!role) return false;
    const r = String(role).toLowerCase();
    return r === 'admin' || r === 'administrator' || r === 'administrador' || r === 'superadmin' || r.includes('admin');
  }

  private handle(): boolean | UrlTree {
    // Requiere autenticación previa (AuthGuard debe ir antes idealmente)
    const user = this.auth.getUser();
    if (user && this.isAdminRole(user.role)) return true;
    // Redirigir a dashboard de usuario si está autenticado, si no a login admin
    return this.auth.isAuthenticated()
      ? this.router.parseUrl('/usuario/dashboard')
      : this.router.parseUrl('/admin/login');
  }

  canActivate(): boolean | UrlTree { return this.handle(); }
  canActivateChild(): boolean | UrlTree { return this.handle(); }
}

