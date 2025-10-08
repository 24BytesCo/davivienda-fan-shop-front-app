import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  // quick register fields
  regFirstName = '';
  regLastName = '';
  regEmail = '';
  regPassword = '';
  remember = true;
  isRegister = false;

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    // TODO: replace with real auth
    this.auth.login('demo-token');
    this.router.navigate(['/admin']);
  }

  quickRegister(): void {
    // TODO: implement real registration
    this.auth.login('demo-token');
    this.router.navigate(['/admin']);
  }
}
