import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserRoutingModule } from './user-routing.module';
import { AdminModule } from '../admin/admin.module';
import { UserDashboardComponent } from './pages/dashboard/user-dashboard.component';

@NgModule({
  declarations: [UserDashboardComponent],
  imports: [CommonModule, RouterModule, UserRoutingModule, AdminModule],
})
export class UserModule {}
