//Estados posibles de un problema
export type Estado = 'Pendiente' | 'Intentando' | 'Resuelto';

//Modelo principal de un problema recibido desde la API
export interface Problem {
  id: number;
  titulo: string;
  plataforma: string;
  dificultad: number | null;
  estado: Estado;
  url: string | null;
  tag: string | null;
}

//Datos enviados al crear o actualizar un problema (sin id)
export type ProblemInput = Omit<Problem, 'id'>;

export const PLATAFORMAS = ['Codeforces', 'LeetCode', 'CSES', 'AtCoder', 'Otra'];
export const ESTADOS: Estado[] = ['Pendiente', 'Intentando', 'Resuelto'];