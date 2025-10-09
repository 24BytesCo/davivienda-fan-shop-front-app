import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { AdminGuard } from '../../core/guards/admin.guard';

import { ConfiguracionComponent } from './pages/configuracion/configuracion.component';
import { TasaConfigComponent } from './components/tasa-config/tasa-config.component';
import { PuntosAdminComponent } from './components/puntos-admin/puntos-admin.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  {
    path: 'configuracion',
    component: ConfiguracionComponent,
    canActivate: [AuthGuard, AdminGuard],
    canActivateChild: [AdminGuard],
    children: [
      { path: 'tasa', component: TasaConfigComponent },
      { path: 'puntos', component: PuntosAdminComponent },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
