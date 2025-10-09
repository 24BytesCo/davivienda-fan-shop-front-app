import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface OrdenItem {
  producto: any;
  cantidad: number;
  pointsUnit: number;
}

export interface Orden {
  id: string;
  userId: string;
  modoPago: 'puntos' | 'dinero';
  estado: 'PENDIENTE' | 'PAGADA' | string;
  totalPoints: number;
  totalCop?: number;
  items?: OrdenItem[];
}

@Injectable({ providedIn: 'root' })
export class OrdenesService {
  private readonly baseUrl = `${environment.apiUrl}/ordenes`;
  constructor(private http: HttpClient) {}

  checkout(userId: string, modoPago: 'puntos' | 'dinero'): Observable<Orden> {
    return this.http
      .post<any>(`${this.baseUrl}/checkout/${userId}`, { modoPago })
      .pipe(map((res) => (res?.data ?? res) as Orden));
  }

  confirmarPago(ordenId: string): Observable<{ id: string; estado: 'PAGADA' | string }> {
    return this.http
      .post<any>(`${this.baseUrl}/${ordenId}/confirmar-pago`, {})
      .pipe(map((res) => (res?.data ?? res)));
  }

  listByUser(userId: string): Observable<Orden[]> {
    return this.http
      .get<any>(`${this.baseUrl}/usuario/${userId}`)
      .pipe(map((res) => (res?.data ?? res) as Orden[]));
  }
}
