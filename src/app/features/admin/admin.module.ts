import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { ProductsAdminComponent } from './components/products-admin/products-admin.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AdminNavComponent,
    ProductsAdminComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
