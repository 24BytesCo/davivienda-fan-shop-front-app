import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly baseUrl = `${environment.apiUrl}/carrito`;
  private readonly storageKey = 'cart_local';

  private cartSubject = new BehaviorSubject<Cart>({ items: [] });
  cart$ = this.cartSubject.asObservable();

constructor(private http: HttpClient, private notify: NotificationService, private auth: AuthService) {
    // Inicial local por si el backend no está listo
    const local = this.readLocal();
    if (local) this.cartSubject.next(local);
    this.refresh().subscribe();
  }

  get count$(): Observable<number> {
    return this.cart$.pipe(map(c => c.items.reduce((acc, it) => acc + (it.quantity || 0), 0)));
  }

  refresh(): Observable<Cart> {
    const userId = this.getUserId();
    if (!userId) return of(this.cartSubject.value);
    return this.http.get<any>(`${this.baseUrl}/${userId}`).pipe(
      map(res => this.unwrapCart(res)),
      tap(cart => { this.cartSubject.next(cart); this.writeLocal(cart); }),
      catchError(() => of(this.cartSubject.value))
    );
  }

  add(productId: string | number, quantity = 1, productHint?: Product): Observable<Cart> {
    const userId = this.getUserId();
    const payload: any = { userId, productoId: String(productId), cantidad: quantity };
    if (userId) {
      return this.http.post<any>(`${this.baseUrl}/items`, payload).pipe(
        map(res => this.unwrapCart(res)),
        map(cart => this.mergeProductHint(cart, productId, productHint)),
        tap(cart => { this.cartSubject.next(cart); this.writeLocal(cart); this.notify.toastSuccess('Añadido al carrito'); }),
        catchError(() => this.addFallbackLocal(productId, quantity, productHint))
      );
    }
    return this.addFallbackLocal(productId, quantity, productHint);
  }

  update(productId: string | number, quantity: number): Observable<Cart> {
    if (quantity <= 0) return this.remove(productId);
    const userId = this.getUserId();
    const payload: any = { userId, productoId: String(productId), cantidad: quantity };
    if (userId) {
      return this.http.patch<any>(`${this.baseUrl}/items`, payload).pipe(
        map(res => this.unwrapCart(res)),
        tap(cart => { this.cartSubject.next(cart); this.writeLocal(cart); }),
        catchError(() => this.updateFallbackLocal(productId, quantity))
      );
    }
    return this.updateFallbackLocal(productId, quantity);
  }

  remove(productId: string | number): Observable<Cart> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.delete<any>(`${this.baseUrl}/items/${userId}/${productId}`).pipe(
        map(res => this.unwrapCart(res)),
        tap(cart => { this.cartSubject.next(cart); this.writeLocal(cart); }),
        catchError(() => this.removeFallbackLocal(productId))
      );
    }
    return this.removeFallbackLocal(productId);
  }

  private updateFallbackLocal(productId: string | number, quantity: number): Observable<Cart> {
    const current = { ...this.cartSubject.value } as Cart;
    const idx = current.items.findIndex(i => i.productId === productId);
    if (idx >= 0) current.items[idx].quantity = quantity; else current.items.push({ productId, quantity });
    this.cartSubject.next(current);
    this.writeLocal(current);
    return of(current);
  }

  private removeFallbackLocal(productId: string | number): Observable<Cart> {
    const current = { ...this.cartSubject.value } as Cart;
    current.items = current.items.filter(i => i.productId !== productId);
    this.cartSubject.next(current);
    this.writeLocal(current);
    return of(current);
  }

  private addFallbackLocal(productId: string | number, quantity = 1, productHint?: Product): Observable<Cart> {
    const current = { ...this.cartSubject.value } as Cart;
    const idx = current.items.findIndex(i => i.productId === productId);
    if (idx >= 0) {
      current.items[idx].quantity += quantity;
      if (productHint) current.items[idx].product = productHint;
    } else {
      current.items.push({ productId, quantity, product: productHint });
    }
    this.cartSubject.next(current);
    this.writeLocal(current);
    return of(current);
  }

  private mergeProductHint(cart: Cart, productId: string | number, productHint?: Product): Cart {
    if (!productHint) return cart;
    const updated: Cart = { ...cart, items: (cart.items || []).map(i => ({ ...i })) };
    for (const it of updated.items) {
      if (it.productId === productId) {
        it.product = it.product ?? productHint;
      }
    }
    return updated;
  }

  private unwrapCart(res: any): Cart {
    const data = res?.data ?? res;
    if (!data) return { items: [] };
    // Common shapes: { id, items: [...] } or the array itself
    const items = Array.isArray(data) ? data as any[] : (data.items ?? []);
    return {
      id: data.id,
      items: items.map((i: any) => ({
        id: i.id ?? i.itemId,
        productId: i.productId ?? i.productoId ?? i.product?.id ?? i.producto?.id,
        quantity: i.quantity ?? i.cantidad ?? 1,
        product: i.product ?? i.producto
      }))
    };
  }

  private readLocal(): Cart | null {
    try { const raw = localStorage.getItem(this.storageKey); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  private writeLocal(cart: Cart) {
    try { localStorage.setItem(this.storageKey, JSON.stringify(cart)); } catch {}
  }

  clear(): Observable<Cart> {
    const userId = this.getUserId();
    if (userId) {
      return this.http.delete<any>(`${this.baseUrl}/${userId}`).pipe(
        map(res => this.unwrapCart(res)),
        tap(cart => { this.cartSubject.next(cart); this.writeLocal(cart); }),
        catchError(() => {
          this.cartSubject.next({ items: [] });
          this.writeLocal({ items: [] });
          return of({ items: [] });
        })
      );
    }
    this.cartSubject.next({ items: [] });
    this.writeLocal({ items: [] });
    return of({ items: [] });
  }

  private getUserId(): string | null {
    try { return (this as any).auth?.getUser?.()?.id ?? null; } catch { return null; }
  }

  /** Inyecta detalles de producto a un ítem existente (para mostrar miniaturas). */
  patchItemProduct(product: Product): void {
    if (!product?.id) return;
    const current = this.cartSubject.value;
    const updated: Cart = { ...current, items: (current.items || []).map(i => ({ ...i })) };
    let changed = false;
    for (const it of updated.items) {
      if (String(it.productId) === String(product.id)) {
        it.product = product;
        changed = true;
      }
    }
    if (changed) {
      this.cartSubject.next(updated);
      this.writeLocal(updated);
    }
  }
}
