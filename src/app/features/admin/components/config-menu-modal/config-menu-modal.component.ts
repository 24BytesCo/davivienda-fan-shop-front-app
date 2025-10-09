import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config-menu-modal',
  templateUrl: './config-menu-modal.component.html',
  styleUrls: ['./config-menu-modal.component.css']
})
export class ConfigMenuModalComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  constructor(private router: Router) {}

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  goTo(path: 'tasa' | 'puntos'): void {
    this.close();
    this.router.navigate(['/admin/configuracion', path]);
  }

  @HostListener('document:keydown.escape') onEsc() {
    if (this.open) this.close();
  }
}

