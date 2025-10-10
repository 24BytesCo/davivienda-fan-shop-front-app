import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Orden, OrdenesService } from '../../../../core/services/ordenes.service';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  orders: Orden[] = [];
  showDetails = false;
  selected: Orden | null = null;

  constructor(
    private auth: AuthService,
    private ordenes: OrdenesService,
    private products: ProductService,
  ) {}

  /** Carga las órdenes del usuario al iniciar. */
  ngOnInit(): void { this.fetchOrders(); }

  /** Recupera y almacena las órdenes del usuario. */
  private fetchOrders(): void {
    this.loading = true;
    this.error = null;
    this.ordenes.listMine().subscribe({
      next: (list) => { this.orders = list || []; this.enrichProductImages(this.orders); this.loading = false; },
      error: (err) => { this.loading = false; this.error = (err?.error?.message as string) || 'No fue posible cargar tus órdenes'; }
    });
  }

  get userName(): string { return this.auth.getUser()?.fullName || ''; }

  viewDetails(o: Orden): void { this.selected = o; this.showDetails = true; }
  closeDetails(): void { this.showDetails = false; }

  /** Intenta completar imágenes de productos faltantes en las órdenes. */
  private enrichProductImages(orders: Orden[]): void {
    try {
      for (const o of orders || []) {
        for (const it of (o.items || [])) {
          const p: any = it.producto;
          const hasImg = !!(p && p.images && p.images.length > 0 && p.images[0]?.url);
          const pid = p?.id || p?._id || p?.productId || it?.productoId;
          if (!hasImg && pid) {
            this.products.getById$(String(pid)).subscribe(prod => {
              if (prod) {
                it.producto = { ...(it.producto || {}), ...prod };
              }
            });
          }
        }
      }
    } catch {
      // noop: si no se puede enriquecer, mostramos sin imagen
    }
  }
}

