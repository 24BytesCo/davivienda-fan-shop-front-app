import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PublicRoutingModule } from './public-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { InicioComponent } from '../../components/inicio/inicio.component';

@NgModule({
  declarations: [
    InicioComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PublicRoutingModule
  ]
})
export class PublicModule {}

