import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
  }

  // Backward-compatible: direct token setter
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

  authenticate$(email: string, password: string, remember = true): Observable<string> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.http.post<any>(url, { email, password }).pipe(
      map((res: any) => {
        const token = this.extractToken(res);
        if (!token) {
          throw new Error('No token in response');
        }
        this.setToken(token, remember);
        return token;
      }),
      catchError((err: HttpErrorResponse) => {
        return throwError(err);
      })
    );
  }

  register$(payload: { firstName: string; lastName: string; email: string; password: string }, remember = true): Observable<string> {
    const url = `${environment.apiUrl}/auth/register`;
    return this.http.post<any>(url, payload).pipe(
      map((res: any) => {
        const token = this.extractToken(res);
        if (token) {
          this.setToken(token, remember);
          return token;
        }
        // if register does not return token, just return empty string
        return '';
      }),
      catchError((err: HttpErrorResponse) => throwError(err))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.tokenKey);
  }

  private extractToken(res: any): string | null {
    if (!res) return null;
    // Try common token fields
    if (typeof res === 'string') return res;
    if (res.access_token) return res.access_token;
    if (res.token) return res.token;
    if (res.jwt) return res.jwt;
    if (res.data && res.data.token) return res.data.token;
    return null;
  }
}

