import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { CartService } from '../../core/services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from '../../core/models/cart.model';
import { ProductService } from '../../core/services/product.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
/** Cabecera de la web pública: login/logout según sesión. */
export class NavComponent implements OnInit {
  cartCount$!: Observable<number>;
  cart$!: Observable<Cart>;
  showCartDrawer = false;
  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService,
    private cart: CartService,
    private products: ProductService
  ) {}

  ngOnInit(): void {
    this.cartCount$ = this.cart.count$;
    this.cart$ = this.cart.cart$;
    this.cart.refresh().subscribe();
  }

  /** Indica si existe sesión activa */
  get loggedIn(): boolean {
    return this.auth.isAuthenticated();
  }

  /** Cierra la sesión actual y redirige a login */
  logout(): void {
    this.auth.logout();
    this.notify.toastSuccess('Sesión cerrada');
    this.router.navigate(['/admin/login']);
  }

  openCart(ev?: Event) {
    if (ev) ev.preventDefault();
    this.showCartDrawer = true;
    // Enriquecer con imágenes si faltan
    this.cart$.pipe(take(1)).subscribe(cart => {
      (cart.items || []).forEach(it => {
        if (!it.product || !it.product.images || it.product.images.length === 0) {
          this.products.getById$(String(it.productId)).subscribe(p => this.cart.patchItemProduct(p));
        }
      });
    });
  }
  closeCart() { this.showCartDrawer = false; }

  inc(item: any) { const q = (item.quantity || 0) + 1; this.cart.update(item.productId, q).subscribe(); }
  dec(item: any) { const q = (item.quantity || 0) - 1; this.cart.update(item.productId, q).subscribe(); }
  remove(item: any) { this.cart.remove(item.productId).subscribe(); }

  totalPoints(cart: Cart): number {
    return (cart.items || []).reduce((t, i) => {
      const qty = i.quantity || 0;
      const pts = i.product?.points || 0;
      return t + qty * pts;
    }, 0);
  }
}
