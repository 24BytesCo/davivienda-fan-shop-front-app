import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Shared UI components (keep current locations to minimize churn)
import { NavComponent } from '../components/nav/nav.component';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [
    NavComponent,
    FooterComponent
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    NavComponent,
    FooterComponent,
    RouterModule
  ]
})
export class SharedModule {}
