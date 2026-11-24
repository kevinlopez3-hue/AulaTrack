
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

const KEY = 'aulatrack_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private token = signal<string | null>(localStorage.getItem(KEY));
  readonly autenticado = computed(() => {
    const t = this.token();
    return !!t && !this.expirado(t);
  });

  login(correo: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/auth/login`, { correo, password })
      .pipe(tap((r) => { localStorage.setItem(KEY, r.token); this.token.set(r.token); }));
  }

  logout() {
    localStorage.removeItem(KEY);
    this.token.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken() { return this.token(); }

  // Leer "exp" solo sirve para no mostrar pantallas con un token vencido.
  // La seguridad real la decide siempre el backend.
  private expirado(t: string): boolean {
    try {
      const payload = JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return payload.exp * 1000 < Date.now();
    } catch { return true; }
  }
}