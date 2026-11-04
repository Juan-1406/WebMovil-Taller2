export type Estado = 'Pendiente' | 'Intentando' | 'Resuelto';

export interface Problem {
  id: number;
  titulo: string;
  plataforma: string;
  dificultad: number | null;
  estado: Estado;
  url: string | null;
}

export type ProblemInput = Omit<Problem, 'id'>;

export const PLATAFORMAS = ['Codeforces', 'LeetCode', 'CSES', 'AtCoder', 'Otra'];
export const ESTADOS: Estado[] = ['Pendiente', 'Intentando', 'Resuelto'];