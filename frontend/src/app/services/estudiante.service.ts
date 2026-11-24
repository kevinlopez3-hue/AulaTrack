// src/app/services/estudiante.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Estudiante, EstudianteDatos } from '../models/estudiante';

@Injectable({ providedIn: 'root' })
export class EstudianteService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/estudiantes`;

  listar()                                   { return this.http.get<Estudiante[]>(this.url); }
  obtener(id: number)                        { return this.http.get<Estudiante>(`${this.url}/${id}`); }
  crear(d: EstudianteDatos)                  { return this.http.post<Estudiante>(this.url, d); }
  actualizar(id: number, d: EstudianteDatos) { return this.http.put<Estudiante>(`${this.url}/${id}`, d); }
  eliminar(id: number)                       { return this.http.delete<void>(`${this.url}/${id}`); }
}