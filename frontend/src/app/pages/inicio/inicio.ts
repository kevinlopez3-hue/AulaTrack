// src/app/pages/inicio/inicio.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  template: `
    <section class="tarjeta">
      <h1>Bienvenido a AulaTrack</h1>
      <p>Administra los registros de estudiantes.</p>
      <a class="btn" routerLink="/estudiantes">Ir a estudiantes</a>
    </section>
  `,
})
export class InicioPage {}