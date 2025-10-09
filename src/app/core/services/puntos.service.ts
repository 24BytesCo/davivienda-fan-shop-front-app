import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface SaldoPuntos {
  userId: string;
  saldo: number;
}

@Injectable({ providedIn: 'root' })
export class PuntosService {
  private readonly baseUrl = `${environment.apiUrl}/puntos`;

  constructor(private http: HttpClient) {}

  getSaldo(userId: string): Observable<SaldoPuntos> {
    return this.http
      .get<any>(`${this.baseUrl}/${userId}`)
      .pipe(map((res) => (res?.data ?? res) as SaldoPuntos));
  }

  credit(userId: string, cantidad: number, concepto?: string, ordenId?: string): Observable<SaldoPuntos> {
    return this.http
      .post<any>(`${this.baseUrl}/${userId}/credit`, { cantidad, concepto, ordenId })
      .pipe(map((res) => (res?.data ?? res) as SaldoPuntos));
  }

  debit(userId: string, cantidad: number, concepto?: string, ordenId?: string): Observable<SaldoPuntos> {
    return this.http
      .post<any>(`${this.baseUrl}/${userId}/debit`, { cantidad, concepto, ordenId })
      .pipe(map((res) => (res?.data ?? res) as SaldoPuntos));
  }
}

