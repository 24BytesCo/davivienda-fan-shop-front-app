import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  // Por convención, se expone desde /auth/users en el backend
  private readonly baseUrl = `${environment.apiUrl}/auth/users`;

  constructor(private http: HttpClient) {}

  list$(): Observable<User[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map((res) => (res?.data ?? res) as User[]),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}

