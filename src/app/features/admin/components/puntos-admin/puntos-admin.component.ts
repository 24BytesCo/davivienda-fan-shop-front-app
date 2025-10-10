import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/core/services/usuarios.service';
import { PuntosService, SaldoPuntos } from 'src/app/core/services/puntos.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { User } from 'src/app/core/models/user.model';

interface RowState {
  saldo?: number | null;
  loadingSaldo?: boolean;
  working?: boolean;
  cantidad?: number | null;
  concepto?: string;
}

@Component({
  selector: 'app-puntos-admin',
  templateUrl: './puntos-admin.component.html',
  styleUrls: ['./puntos-admin.component.css']
})
export class PuntosAdminComponent {
  users: User[] = [];
  rows: Record<string, RowState> = {};
  loading = true;
  loadError = false;

  // Fallback manual
  manual = {
    userId: '',
    cantidad: null as number | null,
    concepto: ''
  };
  workingManual = false;

  constructor(
    private usuarios: UsuariosService,
    private puntos: PuntosService,
    private notify: NotificationService,
  ) {
    this.load();
  }

  /** Carga la lista de usuarios para administrar puntos. */
  load(): void {
    this.loading = true;
    this.loadError = false;
    this.usuarios.list$().subscribe({
      next: (list) => {
        this.users = list || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  /** Obtiene/crea el estado de una fila por usuario. */
  stateOf(id: string): RowState {
    return (this.rows[id] ||= {});
  }

  /** Consulta el saldo de puntos del usuario. */
  cargarSaldo(u: User): void {
    const st = this.stateOf(u.id);
    st.loadingSaldo = true;
    this.puntos.getSaldo(u.id).subscribe({
      next: (s: SaldoPuntos) => { st.saldo = s?.saldo ?? 0; st.loadingSaldo = false; },
      error: () => { st.loadingSaldo = false; this.notify.error('No se pudo obtener el saldo'); }
    });
  }

  /** Acredita puntos al usuario con la cantidad y concepto ingresados. */
  acreditar(u: User): void {
    const st = this.stateOf(u.id);
    const cantidad = Number(st.cantidad ?? 0);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      this.notify.warning('Ingresa una cantidad válida (> 0)');
      return;
    }
    st.working = true;
    this.puntos.credit(u.id, cantidad, st.concepto || 'Ajuste manual').subscribe({
      next: (s) => { st.working = false; st.saldo = s?.saldo ?? null; st.cantidad = null; st.concepto = ''; this.notify.toastSuccess('Puntos acreditados'); },
      error: () => { st.working = false; this.notify.error('No fue posible acreditar'); }
    });
  }

  /** Debita puntos al usuario con la cantidad y concepto ingresados. */
  debitar(u: User): void {
    const st = this.stateOf(u.id);
    const cantidad = Number(st.cantidad ?? 0);
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      this.notify.warning('Ingresa una cantidad válida (> 0)');
      return;
    }
    st.working = true;
    this.puntos.debit(u.id, cantidad, st.concepto || 'Ajuste manual').subscribe({
      next: (s) => { st.working = false; st.saldo = s?.saldo ?? null; st.cantidad = null; st.concepto = ''; this.notify.toastSuccess('Puntos debitados'); },
      error: (e) => { st.working = false; const msg = e?.error?.message || 'No fue posible debitar'; this.notify.error('Error', msg); }
    });
  }

  /** Acredita puntos usando el formulario manual. */
  acreditarManual(): void {
    const { userId } = this.manual;
    const cantidad = Number(this.manual.cantidad ?? 0);
    if (!userId) { this.notify.warning('Ingresa un ID de usuario'); return; }
    if (!Number.isInteger(cantidad) || cantidad <= 0) { this.notify.warning('Cantidad inválida'); return; }
    this.workingManual = true;
    this.puntos.credit(userId, cantidad, this.manual.concepto || 'Ajuste manual').subscribe({
      next: () => { this.workingManual = false; this.notify.toastSuccess('Puntos acreditados'); },
      error: () => { this.workingManual = false; this.notify.error('No fue posible acreditar'); }
    });
  }

  /** Debita puntos usando el formulario manual. */
  debitarManual(): void {
    const { userId } = this.manual;
    const cantidad = Number(this.manual.cantidad ?? 0);
    if (!userId) { this.notify.warning('Ingresa un ID de usuario'); return; }
    if (!Number.isInteger(cantidad) || cantidad <= 0) { this.notify.warning('Cantidad inválida'); return; }
    this.workingManual = true;
    this.puntos.debit(userId, cantidad, this.manual.concepto || 'Ajuste manual').subscribe({
      next: () => { this.workingManual = false; this.notify.toastSuccess('Puntos debitados'); },
      error: (e) => { this.workingManual = false; const msg = e?.error?.message || 'No fue posible debitar'; this.notify.error('Error', msg); }
    });
  }
}

