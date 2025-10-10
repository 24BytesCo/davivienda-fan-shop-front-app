import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  private readonly baseUrl = `${environment.apiUrl}/configuracion`;
  constructor(private http: HttpClient) {}

  // La API retorna { data: number }, desenvuelvo y entrego number
  /** Obtiene la tasa de conversión puntos → COP. */
  getTasa(): Observable<number> {
    return this.http.get<any>(`${this.baseUrl}/tasa`).pipe(
      map(res => (res && res.data !== undefined ? res.data : (res?.valor ?? res)))
    );
  }

  /** Actualiza la tasa de conversión en la API. */
  updateTasa(valor: number): Observable<number> {
    return this.http.put<any>(`${this.baseUrl}/tasa`, { valor }).pipe(
      map(res => (res && res.data !== undefined ? res.data : (res?.valor ?? res)))
    );
  }
}
