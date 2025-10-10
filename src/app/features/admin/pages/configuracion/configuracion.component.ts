import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {
  showOptions = false;

  constructor(private router: Router) {}

  openOptions(): void { this.showOptions = true; }
  closeOptions(): void { this.showOptions = false; }
  /** Navega a la sección de configuración elegida. */
  goTo(path: 'tasa' | 'puntos'): void {
    this.showOptions = false;
    this.router.navigate(['/admin/configuracion', path]);
  }
}
