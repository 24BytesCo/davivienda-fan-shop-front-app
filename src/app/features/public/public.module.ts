import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { InicioComponent } from '../../components/inicio/inicio.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ConfirmacionComponent } from './pages/confirmacion/confirmacion.component';

@NgModule({
  declarations: [
    InicioComponent,
    CheckoutComponent,
    ConfirmacionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PublicRoutingModule
  ]
})
export class PublicModule {}
