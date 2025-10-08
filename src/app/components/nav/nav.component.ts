import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
/** Cabecera de la web pública: login/logout según sesión. */
export class NavComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {}

  /** Indica si existe sesión activa */
  get loggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  /** Cierra la sesión actual y redirige a login */
  logout(): void {
    this.auth.logout();
    this.notify.toastSuccess('Sesión cerrada');
    this.router.navigate(['/admin/login']);
  }
}
