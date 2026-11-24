export interface Estudiante {
  id_estudiante: number;
  documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  fecha_registro: string;
}
export type EstudianteDatos = Omit<Estudiante, 'id_estudiante' | 'fecha_registro'>;