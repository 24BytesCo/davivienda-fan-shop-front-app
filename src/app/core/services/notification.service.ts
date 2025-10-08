import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  success(title: string, text?: string): void {
    Swal.fire({ icon: 'success', title, text, confirmButtonText: 'OK' });
  }

  error(title: string, text?: string): void {
    Swal.fire({ icon: 'error', title, text, confirmButtonText: 'Entendido' });
  }

  info(title: string, text?: string): void {
    Swal.fire({ icon: 'info', title, text, confirmButtonText: 'OK' });
  }

  warning(title: string, text?: string): void {
    Swal.fire({ icon: 'warning', title, text, confirmButtonText: 'OK' });
  }

  toastSuccess(title: string): void {
    this.toast(title, 'success');
  }

  toastError(title: string): void {
    this.toast(title, 'error');
  }

  private toast(title: string, icon: 'success' | 'error' | 'info' | 'warning'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true
    });
    Toast.fire({ icon, title });
  }
}

