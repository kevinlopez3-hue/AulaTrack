import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeError(err: HttpErrorResponse): string {
  if (err.status === 0) return 'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.';
  if (err.status === 403) return 'No tienes permisos para realizar esta acción.';
  return err.error?.error ?? 'Ocurrió un error inesperado.';
}