// src/app/pages/estudiantes/estudiante-form.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstudianteService } from '../../services/estudiante.service';
import { EMAIL_RE, noVacio } from '../../utils/validacion';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-estudiante-form',
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <section class="tarjeta">
      <h1>{{ id ? 'Editar estudiante' : 'Nuevo estudiante' }}</h1>

      @if (cargando()) {
        <p>Cargando datos…</p>
      } @else {
        <form [formGroup]="form" (ngSubmit)="guardar()" novalidate>
          <div class="grid-form">
            @for (c of campos; track c.name) {
              <div class="campo">
                <label [for]="c.name">{{ c.label }}</label>
                <input [id]="c.name" [type]="c.type" [formControlName]="c.name" [class.invalido]="error(c.name)" />
                @if (error(c.name)) { <span class="error">{{ error(c.name) }}</span> }
              </div>
            }
          </div>
          @if (errorGeneral()) { <p class="error">{{ errorGeneral() }}</p> }
          <div class="acciones">
            <button type="submit" [disabled]="guardando()">{{ guardando() ? 'Guardando…' : 'Guardar' }}</button>
            <a class="btn sec" routerLink="/estudiantes">Cancelar</a>
          </div>
        </form>
      }
    </section>
  `,
})
export class EstudianteFormPage {
  private fb = inject(FormBuilder);
  private svc = inject(EstudianteService);
  private router = inject(Router);

  id = Number(inject(ActivatedRoute).snapshot.paramMap.get('id')) || null;

  campos = [
    { name: 'documento', label: 'Documento', type: 'text' },
    { name: 'nombres', label: 'Nombres', type: 'text' },
    { name: 'apellidos', label: 'Apellidos', type: 'text' },
    { name: 'correo', label: 'Correo electrónico', type: 'email' },
  ] as const;

  form = this.fb.nonNullable.group({
    documento: ['', [Validators.required, noVacio, Validators.maxLength(30)]],
    nombres:   ['', [Validators.required, noVacio, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, noVacio, Validators.maxLength(100)]],
    correo:    ['', [Validators.required, Validators.maxLength(150), Validators.pattern(EMAIL_RE)]],
  });

  cargando = signal(false);
  guardando = signal(false);
  errorGeneral = signal<string | null>(null);

  constructor() {
    if (this.id) {
      this.cargando.set(true);
      this.svc.obtener(this.id).subscribe({
        next: (e) => { this.form.patchValue(e); this.cargando.set(false); },
        error: (err) => { this.errorGeneral.set(mensajeDeError(err)); this.cargando.set(false); },
      });
    }
  }

  error(nombre: string): string | null {
    const c = this.form.get(nombre);
    if (!c || !(c.touched || c.dirty) || !c.errors) return null;
    if (c.errors['required']) return 'Este campo es obligatorio.';
    if (c.errors['maxlength']) return `Máximo ${c.errors['maxlength'].requiredLength} caracteres.`;
    if (c.errors['pattern']) return 'El formato del correo no es válido.';
    if (c.errors['servidor']) return c.errors['servidor'];
    return null;
  }

  guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.guardando.set(true);
    this.errorGeneral.set(null);
    const datos = this.form.getRawValue();
    const peticion = this.id ? this.svc.actualizar(this.id, datos) : this.svc.crear(datos);

    peticion.subscribe({
      next: () => this.router.navigate(['/estudiantes'], { queryParams: { ok: this.id ? 'actualizado' : 'creado' } }),
      error: (err) => {
        // Errores por campo que vienen del backend (400 o 409)
        const campos = err.error?.campos as Record<string, string> | undefined;
        if (campos) {
          for (const [campo, msg] of Object.entries(campos)) {
            this.form.get(campo)?.setErrors({ servidor: msg });
            this.form.get(campo)?.markAsTouched();
          }
        }
        this.errorGeneral.set(mensajeDeError(err));
        this.guardando.set(false);
      },
    });
  }
}