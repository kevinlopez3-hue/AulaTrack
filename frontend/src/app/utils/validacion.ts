import { AbstractControl, ValidationErrors } from '@angular/forms';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;   // misma regla que el backend

export function noVacio(c: AbstractControl): ValidationErrors | null {
  return typeof c.value === 'string' && c.value.trim() === '' ? { required: true } : null;
}