import { Component } from '@angular/core';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-tasa-config',
  templateUrl: './tasa-config.component.html',
  styleUrls: ['./tasa-config.component.css']
})
export class TasaConfigComponent {
  tasa: number | null = null;
  loading = true;
  saving = false;

  constructor(
    private config: ConfiguracionService,
    private notify: NotificationService,
  ) {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.config.getTasa().subscribe({
      next: (t) => { this.tasa = t; this.loading = false; },
      error: () => { this.loading = false; this.notify.error('No fue posible cargar la tasa'); }
    });
  }

  save(): void {
    if (this.tasa == null || isNaN(this.tasa) || this.tasa <= 0) {
      this.notify.warning('Ingresa una tasa válida (> 0)');
      return;
    }
    this.saving = true;
    this.config.updateTasa(this.tasa).subscribe({
      next: () => { this.saving = false; this.notify.toastSuccess('Tasa actualizada'); },
      error: () => { this.saving = false; this.notify.error('No se pudo actualizar la tasa'); }
    });
  }
}

