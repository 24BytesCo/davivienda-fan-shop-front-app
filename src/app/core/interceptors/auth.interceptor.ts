import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

/** Interceptor HTTP: añade Authorization y muestra mensajes de error del backend. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private notify: NotificationService,
  ) {}

  /** Intercepta la petición y añade el Bearer token si aplica. */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.auth.getToken();
    const isApiRequest = req.url.startsWith('http') ? req.url.startsWith(environment.apiUrl) : true;

    if (token && isApiRequest) {
      authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = this.extractMessage(err);
        if (err.status === 401) {
          this.auth.logout();
          this.notify.error('Autenticación', msg || 'Sesión expirada, vuelve a iniciar sesión');
          this.router.navigate(['/admin/login']);
        } else {
          if (msg) this.notify.error('Error', msg);
        }
        return throwError(err);
      })
    );
  }

  /** Extrae mensaje de error (propiedad message del backend u otros) */
  private extractMessage(err: any): string {
    try {
      const e = err as HttpErrorResponse;
      const data: any = e?.error;
      let m: any = data?.message ?? data?.msg ?? data?.error ?? e?.message;
      if (Array.isArray(m)) m = m.join(', ');
      if (typeof m === 'string' && m.trim().length) return m;
      if (e?.status === 0) return 'No fue posible conectar con la API.';
    } catch {}
    return '';
  }
}

