// src/app/app.ts  (reemplaza el contenido; borra app.html si existe)
import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    @if (auth.autenticado()) {
      <header class="barra">
        <strong><a routerLink="/">AulaTrack</a></strong>
        <nav class="acciones">
          <a routerLink="/estudiantes">Estudiantes</a>
          <button class="sec" (click)="auth.logout()">Cerrar sesión</button>
        </nav>
      </header>
    }
    <main><router-outlet /></main>
  `,
})
export class App {
  auth = inject(AuthService);
}