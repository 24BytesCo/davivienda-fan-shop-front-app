import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cart } from 'src/app/core/models/cart.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CartService } from 'src/app/core/services/cart.service';
import { ConfiguracionService } from 'src/app/core/services/configuracion.service';
import { OrdenesService, Orden } from 'src/app/core/services/ordenes.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart?: Cart;
  loading = false;
  mode: 'puntos' | 'dinero' = 'puntos';
  tasa = 0;
  totalCop = 0;

  // fake payment form
  cardNumber = '';
  nameOnCard = '';
  expMonth = '';
  expYear = '';
  cvc = '';
  installments = 1;

  constructor(
    private auth: AuthService,
    private cartSvc: CartService,
    private cfg: ConfiguracionService,
    private orders: OrdenesService,
    private notify: NotificationService,
    private router: Router
  ) {}

  /** Verifica sesión, carga carrito y tasa si aplica. */
  ngOnInit(): void {
    const user = this.auth.getUser();
    if (!user) {
      this.notify.error('Debes iniciar sesión para pagar');
      this.router.navigate(['/admin/login']);
      return;
    }
    this.loading = true;
    this.cartSvc.refresh().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
        this.loadTasaIfNeeded();
      },
      error: () => (this.loading = false)
    });
  }

  /** Cambia el modo de pago y recalcula totales. */
  switchMode(mode: 'puntos'|'dinero') {
    this.mode = mode;
    this.loadTasaIfNeeded();
  }

  /** Carga la tasa cuando el modo de pago es en dinero. */
  private loadTasaIfNeeded() {
    if (this.mode === 'dinero') {
      this.cfg.getTasa().subscribe(t => {
        this.tasa = t;
        const totalPts = this.getTotalPoints();
        this.totalCop = totalPts * this.tasa;
      });
    }
  }

  /** Obtiene el total de puntos del carrito. */
  getTotalPoints(): number {
    const items = this.cart?.items || [];
    return items.reduce((acc, it) => acc + (it.quantity || 0) * (it.product?.points || 0), 0);
  }

  /** Ejecuta el flujo de pago según el modo seleccionado. */
  pay() {
    const user = this.auth.getUser();
    if (!user) return;
    // Validate when paying with money
    if (this.mode === 'dinero') {
      if (!this.validateCard()) { this.notify.error('Datos de tarjeta inválidos'); return; }
    }
    this.loading = true;
    this.orders.checkout(user.id, this.mode).subscribe({
      next: (orden: Orden) => {
        if (this.mode === 'puntos') {
          this.loading = false;
          this.router.navigate(['/confirmacion', orden.id]);
        } else {
          // Fake gateway flow
          setTimeout(() => {
            this.orders.confirmarPago(orden.id).subscribe({
              next: () => {
                this.loading = false;
                this.router.navigate(['/confirmacion', orden.id]);
              },
              error: () => {
                this.loading = false;
                this.notify.error('No se pudo confirmar el pago');
              }
            });
          }, 1800);
        }
      },
      error: (err) => {
        this.loading = false;
        const msg = (err?.error?.message || err?.message || '').toString();
        if (msg.includes('Saldo de puntos insuficiente'))
          this.notify.warning('Saldo de puntos insuficiente');
        else if (msg.includes('Stock'))
          this.notify.warning('Ajusta cantidades: stock insuficiente');
        else
          this.notify.error('No se pudo iniciar el checkout');
      }
    });
  }

  /** Valida de forma básica los datos de la tarjeta. */
  private validateCard(): boolean {
    // Very light validation just to simulate
    const num = this.cardNumber.replace(/\s+/g, '');
    return /^(\d{16})$/.test(num) && /^(\d{2})$/.test(this.expMonth) && /^(\d{2})$/.test(this.expYear) && /^(\d{3,4})$/.test(this.cvc) && this.nameOnCard.trim().length > 3;
  }
}
