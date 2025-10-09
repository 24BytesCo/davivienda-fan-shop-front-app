import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/** Servicio centralizado de notificaciones (SweetAlert2). */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  /** Muestra un cuadro de éxito. */
  success(title: string, text?: string): void {
    Swal.fire({ icon: 'success', title, text, confirmButtonText: 'OK' });
  }

  /** Muestra un cuadro de error. */
  error(title: string, text?: string): void {
    Swal.fire({ icon: 'error', title, text, confirmButtonText: 'Entendido' });
  }

  /** Muestra un cuadro informativo. */
  info(title: string, text?: string): void {
    Swal.fire({ icon: 'info', title, text, confirmButtonText: 'OK' });
  }

  /** Muestra un cuadro de advertencia. */
  warning(title: string, text?: string): void {
    Swal.fire({ icon: 'warning', title, text, confirmButtonText: 'OK' });
  }

  /** Muestra un toast de éxito en la esquina. */
  toastSuccess(title: string): void {
    this.toast(title, 'success');
  }

  /** Muestra un toast de error en la esquina. */
  toastError(title: string): void {
    this.toast(title, 'error');
  }

  /**
   * Muestra un toast genérico en la esquina superior derecha.
   */
  /** Muestra un toast de éxito en la esquina superior izquierda. */
  toastSuccessLeft(title: string): void {
    this.toast(title, 'success', 'top-start');
  }

  /**
   * Muestra un toast genérico en la esquina indicada.
   * Posiciones válidas SweetAlert2: 'top', 'top-start', 'top-end', 'center', 'bottom-start', etc.
   */
  private toast(title: string, icon: 'success' | 'error' | 'info' | 'warning', position: 'top-end' | 'top-start' | 'top' | 'bottom-start' | 'bottom-end' | 'center' = 'top-end'): void {
    const Toast = Swal.mixin({
      toast: true,
      position,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
    Toast.fire({ icon, title });
  }
}

