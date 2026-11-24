// src/app/pages/login/login.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EMAIL_RE } from '../../utils/validacion';
import { mensajeDeError } from '../../utils/errores';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  template: `
    <section class="tarjeta" style="max-width:380px;margin:2rem auto">
      <h1>Iniciar sesión</h1>
      <form [formGroup]="form" (ngSubmit)="entrar()">
        <div class="campo">
          <label for="correo">Correo</label>
          <input id="correo" type="email" formControlName="correo" autocomplete="username" />
        </div>
        <div class="campo">
          <label for="password">Contraseña</label>
          <input id="password" type="password" formControlName="password" autocomplete="current-password" />
        </div>
        @if (error()) { <p class="error">{{ error() }}</p> }
        <button type="submit" [disabled]="cargando()">{{ cargando() ? 'Ingresando…' : 'Ingresar' }}</button>
      </form>
    </section>
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.pattern(EMAIL_RE)]],
    password: ['', Validators.required],
  });
  cargando = signal(false);
  error = signal<string | null>(null);

  entrar() {
    if (this.form.invalid) { this.error.set('Escribe un correo válido y tu contraseña.'); return; }
    this.cargando.set(true);
    this.error.set(null);
    const { correo, password } = this.form.getRawValue();
    this.auth.login(correo, password).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err) => { this.error.set(mensajeDeError(err)); this.cargando.set(false); },
    });
  }
}