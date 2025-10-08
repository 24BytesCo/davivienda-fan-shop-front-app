import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.css']
})
export class AdminNavComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService
  ) {}

  get loggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  logout(): void {
    this.auth.logout();
    this.notify.toastSuccess('Sesión cerrada');
    this.router.navigate(['/admin/login']);
  }
}

