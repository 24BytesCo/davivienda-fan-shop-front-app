import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '../../components/inicio/inicio.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'confirmacion/:id', component: ConfirmacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
