// src/app/interceptors/auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  // Solo se adjunta el token a TU API, nunca a otros dominios
  const peticion = token && req.url.startsWith(environment.apiUrl)
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.includes('/auth/login')) auth.logout();  // sesión vencida o inválida
      return throwError(() => err);   // 403 y demás: cada pantalla lo muestra con mensajeDeError
    })
  );
};