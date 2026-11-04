import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { API_URL } from './api.config';

interface TokenResponse {
  access_token: string;
  token_type: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly token = signal<string | null>(localStorage.getItem('token'));
  readonly username = signal<string | null>(localStorage.getItem('username'));
  readonly isLoggedIn = computed(() => !!this.token());

  register(data: { username: string; email: string; password: string }) {
    return this.http.post(`${API_URL}/auth/register`, data);
  }

  login(data: { username: string; password: string }) {
    return this.http.post<TokenResponse>(`${API_URL}/auth/login`, data).pipe(
      tap((res) => {
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('username', res.username);
        this.token.set(res.access_token);
        this.username.set(res.username);
      }),
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.token.set(null);
    this.username.set(null);
    this.router.navigate(['/login']);
  }
}