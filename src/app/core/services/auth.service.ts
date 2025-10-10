import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

/**
 * Servicio de autenticación.
 * - Gestiona token y usuario autenticado.
 * - Expone estado reactivo de sesión.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Clave de almacenamiento del token */
  private readonly tokenKey = 'auth_token';
  /** Clave de almacenamiento del usuario */
  private readonly userKey = 'auth_user';

  /** Sujeto reactivo con el usuario actual */
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  /** Flujo público del usuario actual */
  currentUser$ = this.currentUserSubject.asObservable();

  /**
   * Rehidrata estado de sesión desde almacenamiento al construir el servicio.
   */
  constructor(private http: HttpClient) {
    this.rehydrate();
  }

  /** Indica si hay token almacenado (sesión activa). */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /** Obtiene el token JWT desde local/sessionStorage. */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  /** Compatibilidad: permite fijar un token directamente */
  login(token: string): void {
    this.setToken(token, true);
  }

  setToken(token: string, remember = true): void {
    if (remember) {
      localStorage.setItem(this.tokenKey, token);
      sessionStorage.removeItem(this.tokenKey);
    } else {
      sessionStorage.setItem(this.tokenKey, token);
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Autentica contra la API y persiste token y usuario cuando están disponibles.
   */
  authenticate$(email: string, password: string, remember = true): Observable<string> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post<any>(url, { email, password }).pipe(
      map((res: any) => {
        const token = this.extractToken(res);
        const user = this.extractUser(res);
        if (!token) {
          throw new Error('No se encontró token en la respuesta');
        }
        this.setToken(token, remember);
        if (user) {
          this.setUser(user, remember);
          this.currentUserSubject.next(user);
        }
        return token;
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  /**
   * Registra un usuario nuevo y persiste sesión si la API retorna token y usuario.
   */
  register$(payload: { fullName: string; email: string; password: string }, remember = true): Observable<string> {
    const url = `${environment.apiUrl}/auth/register`;
    return this.http.post<any>(url, payload).pipe(
      map((res: any) => {
        const token = this.extractToken(res);
        const user = this.extractUser(res);
        if (token) {
          this.setToken(token, remember);
          if (user) {
            this.setUser(user, remember);
            this.currentUserSubject.next(user);
          }
          return token;
        }
        // Si el registro no retorna token, devolver cadena vacía
        return '';
      }),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  /** Cierra sesión: elimina token y usuario de almacenamiento. */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    sessionStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  /**
   * Extrae el token desde distintas formas de respuesta comunes.
   */
  private extractToken(res: any): string | null {
    if (!res) return null;
    // Intentar campos comunes de token
    if (typeof res === 'string') return res;
    if (res.access_token) return res.access_token;
    if (res.token) return res.token;
    if (res.jwt) return res.jwt;
    if (res.data && res.data.token) return res.data.token;
    return null;
  }

  /**
   * Extrae el usuario desde el envoltorio de respuesta
   */
  private extractUser(res: any): User | null {
    if (!res) return null;
    const user = res.data?.user || res.user;
    return user ?? null;
  }

  /**
   * Persiste el usuario en el almacenamiento correspondiente.
   */
  private setUser(user: User, remember?: boolean): void {
    const storage = this.resolveStorageForWrite(remember);
    storage.setItem(this.userKey, JSON.stringify(user));
    // Mantener un único almacenamiento en sincronía
    (storage === localStorage ? sessionStorage : localStorage).removeItem(this.userKey);
  }

  /** Devuelve el usuario actual desde memoria o almacenamiento. */
  getUser(): User | null {
    const current = this.currentUserSubject.value;
    if (current) return current;
    // Intentar cargar desde almacenamiento
    const raw = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as User;
      this.currentUserSubject.next(parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  /** Carga el estado en memoria si existen datos persistidos. */
  private rehydrate(): void {
    const user = this.getUser();
    if (user && this.getToken()) {
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Resuelve dónde escribir según "remember" o almacenamiento existente del token.
   */
  private resolveStorageForWrite(remember?: boolean): Storage {
    if (remember !== undefined) return remember ? localStorage : sessionStorage;
    // Si ya existe token, alinear almacenamiento con el token
    if (localStorage.getItem(this.tokenKey)) return localStorage;
    if (sessionStorage.getItem(this.tokenKey)) return sessionStorage;
    return localStorage;
  }
}

