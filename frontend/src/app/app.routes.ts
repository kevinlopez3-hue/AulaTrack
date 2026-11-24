// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginPage } from './pages/login/login';
import { InicioPage } from './pages/inicio/inicio';
import { EstudiantesListaPage } from './pages/estudiantes/estudiantes-lista';
import { EstudianteFormPage } from './pages/estudiantes/estudiante-form';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: '', component: InicioPage, canActivate: [authGuard] },
  { path: 'estudiantes', component: EstudiantesListaPage, canActivate: [authGuard] },
  { path: 'estudiantes/nuevo', component: EstudianteFormPage, canActivate: [authGuard] },
  { path: 'estudiantes/:id/editar', component: EstudianteFormPage, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];