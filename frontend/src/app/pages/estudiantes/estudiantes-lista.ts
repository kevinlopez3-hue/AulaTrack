// src/app/pages/estudiantes/estudiantes-lista.ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Estudiante } from '../../models/estudiante';
import { EstudianteService } from '../../services/estudiante.service';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-estudiantes-lista',
  imports: [RouterLink],
  template: `
    <div class="acciones" style="justify-content:space-between;align-items:center">
      <h1>Estudiantes</h1>
      <a class="btn" routerLink="/estudiantes/nuevo">Nuevo estudiante</a>
    </div>

    @if (mensaje()) { <p class="ok">{{ mensaje() }}</p> }
    @if (errorAccion()) { <p class="error">{{ errorAccion() }}</p> }

    @if (cargando()) {
      <p>Cargando estudiantes…</p>
    } @else if (error()) {
      <p class="error">{{ error() }}</p>
      <button (click)="cargar()">Reintentar</button>
    } @else if (estudiantes().length === 0) {
      <p>Aún no hay estudiantes registrados.</p>
    } @else {
      <div class="tarjeta tabla-wrap">
        <table>
          <thead><tr><th>Documento</th><th>Nombres</th><th>Apellidos</th><th>Correo</th><th></th></tr></thead>
          <tbody>
            @for (e of estudiantes(); track e.id_estudiante) {
              <tr>
                <td>{{ e.documento }}</td><td>{{ e.nombres }}</td><td>{{ e.apellidos }}</td><td>{{ e.correo }}</td>
                <td class="acciones">
                  <a class="btn sec" [routerLink]="['/estudiantes', e.id_estudiante, 'editar']">Editar</a>
                  <button class="peligro" (click)="eliminar(e)">Eliminar</button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class EstudiantesListaPage {
  private svc = inject(EstudianteService);

  estudiantes = signal<Estudiante[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);
  errorAccion = signal<string | null>(null);
  mensaje = signal<string | null>(null);

  constructor() {
    const ok = inject(ActivatedRoute).snapshot.queryParamMap.get('ok');
    if (ok === 'creado') this.mensaje.set('Estudiante creado correctamente.');
    if (ok === 'actualizado') this.mensaje.set('Estudiante actualizado correctamente.');
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.error.set(null);
    this.svc.listar().subscribe({
      next: (datos) => { this.estudiantes.set(datos); this.cargando.set(false); },
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }

  eliminar(e: Estudiante) {
    if (!confirm(`¿Eliminar a ${e.nombres} ${e.apellidos}? Esta acción no se puede deshacer.`)) return;
    this.errorAccion.set(null);
    this.svc.eliminar(e.id_estudiante).subscribe({
      next: () => { this.mensaje.set('Estudiante eliminado correctamente.'); this.cargar(); },
      error: (err) => this.errorAccion.set(mensajeDeError(err)),
    });
  }
}