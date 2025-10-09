import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
})
export class UserDashboardComponent {
  constructor(private auth: AuthService) {}
  get userName(): string { return this.auth.getUser()?.fullName || ''; }
}

