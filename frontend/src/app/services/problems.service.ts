import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { API_URL } from './api.config';
import { Problem, ProblemInput } from '../models/problem';

@Injectable({ providedIn: 'root' })
export class ProblemsService {
  private http = inject(HttpClient);

  listResource(filters: () => { plataforma: string; estado: string; tag?: string }) {
    return httpResource<Problem[]>(() => {
      const f = filters();
      const params: Record<string, string> = {};
      if (f.plataforma) params['plataforma'] = f.plataforma;
      if (f.estado) params['estado'] = f.estado;
      if (f.tag) params['tag'] = f.tag;
      return { url: `${API_URL}/problems`, params };
    });
  }

  tagsResource() {
    return httpResource<string[]>(() => `${API_URL}/problems/tags`);
  }

  create(data: ProblemInput) {
    return this.http.post<Problem>(`${API_URL}/problems`, data);
  }

  update(id: number, data: ProblemInput) {
    return this.http.put<Problem>(`${API_URL}/problems/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete<void>(`${API_URL}/problems/${id}`);
  }
}