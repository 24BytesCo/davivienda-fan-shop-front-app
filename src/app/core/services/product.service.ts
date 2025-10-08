import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PaginatedResult, Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  list$(page = 1, limit = 10, q = ''): Observable<PaginatedResult<Product>> {

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const offset = (safePage - 1) * safeLimit;

    let params = new HttpParams()
      .set('limit', String(safeLimit))
      .set('offset', String(offset));

    if (q) params = params.set('q', q); // si el backend lo soporta
    
    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map((res) => {
        // La API retorna: { ok, statusCode, message, data: Product[] }
        const items: Product[] = Array.isArray(res?.data)
          ? res.data
          : res?.items || res || [];
        const hasNext = items.length === safeLimit; // heurística basada en page-size
        return {
          items,
          limit: safeLimit,
          offset,
          hasNext,
          hasPrev: safePage > 1,
          page: safePage,
        } as PaginatedResult<Product>;
      })
    );
  }

  getById$(id: string): Observable<Product> {
    return this.http
      .get<any>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => this.unwrapEntity<Product>(res)));
  }

  create$(
    data: Partial<Product>,
    files: File[] = [],
    imageUrls: string[] = []
  ): Observable<Product> {
    const form = this.buildFormData(data, files, imageUrls);
    return this.http
      .post<any>(this.baseUrl, form)
      .pipe(map((res) => this.unwrapEntity<Product>(res)));
  }

  update$(
    id: string | number,
    data: Partial<Product>,
    files: File[] = [],
    imageUrls: string[] = []
  ): Observable<string> {
    const form = this.buildFormData(data, files, imageUrls);
    // La API retorna StandardResponseDto con data: string (ID)
    return this.http
      .patch<any>(`${this.baseUrl}/${id}`, form)
      .pipe(map((res) => res?.data ?? res));
  }

  delete$(id: string | number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  /** Subida explícita de imágenes en endpoint dedicado (si la API lo requiere). */
  uploadImages$(id: string | number, files: File[]) {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    return this.http.post(`${this.baseUrl}/${id}/imagenes`, form);
  }

  /** Helpers */
  private buildFormData(
    data: Partial<Product>,
    files: File[],
    imageUrls: string[] = []
  ): FormData {
    const form = new FormData();
    const entries: Record<string, any> = {
      title: data.title,
      description: data.description,
      points: data.points,
      stock: data.stock,
      category: data.category ? String(data.category).toLowerCase() : undefined,
      slug: (data as any).slug,
    };
    Object.entries(entries).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') form.append(k, String(v));
    });

    // Enviar tallas como arreglo (múltiples campos 'sizes')
    if (Array.isArray(data.sizes)) {
      data.sizes.forEach((s) => form.append('sizes', String(s).toUpperCase()));
    }

    // Enviar SOLO uno de los dos: archivos o urls
    if (files && files.length > 0) {
      files.forEach((f) => form.append('images', f));
    } else if (imageUrls && imageUrls.length > 0) {
      imageUrls.forEach((u) => form.append('images', u));
    }
    return form;
  }

  private unwrapEntity<T>(res: any): T {
    if (!res) return res as T;
    // Intentar formas comunes: { data }, { item }, directo
    return (res.data ?? res.item ?? res) as T;
  }
  private unwrapPaginated<T>(res: any): PaginatedResult<T> {
    if (!res) return { items: [], total: 0, page: 1, lastPage: 1 } as any;
    const data = res.data ?? res;
    return {
      items: data.items ?? data.results ?? data.data ?? [],
      total: data.total ?? data.count ?? 0,
      page: data.page ?? 1,
      lastPage:
        data.lastPage ??
        Math.max(1, Math.ceil((data.total ?? 0) / (data.limit ?? 10))),
    } as any;
  }
}
