import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { ProductsAdminComponent } from './components/products-admin/products-admin.component';
import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { TasaConfigComponent } from './components/tasa-config/tasa-config.component';
import { PuntosAdminComponent } from './components/puntos-admin/puntos-admin.component';
import { ConfigMenuModalComponent } from './components/config-menu-modal/config-menu-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AdminNavComponent,
    ProductsAdminComponent,
    ConfiguracionComponent,
    TasaConfigComponent,
    PuntosAdminComponent,
    ConfigMenuModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule
  ],
  exports: [
    AdminNavComponent
  ]
})
export class AdminModule {}
