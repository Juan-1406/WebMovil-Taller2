import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../services/auth.service';
import { ProblemsService } from '../services/problems.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="gh-container">
      <!-- Columna Izquierda: Sidebar estilo GitHub -->
      <aside class="gh-sidebar">
        <div class="gh-avatar">
          <span>{{ (auth.username() || 'U').charAt(0).toUpperCase() }}</span>
        </div>
        <h1 class="gh-fullname">{{ auth.username() }}</h1>
        <p class="gh-username">&#64;{{ auth.username() }}</p>
        <p class="gh-bio">Competidor ICPC | Algoritmos y Estructuras de Datos</p>

        <button mat-stroked-button class="btn-logout" (click)="auth.logout()">
          <mat-icon>logout</mat-icon> Cerrar sesión
        </button>

        <div class="gh-meta">
          <div class="meta-item">
            <mat-icon>terminal</mat-icon>
            <span>Frontend & Backend Developer</span>
          </div>
          <div class="meta-item">
            <mat-icon>check_circle</mat-icon>
            <span><strong>{{ solvedProblems().length }}</strong> resueltos</span>
          </div>
        </div>
      </aside>

      <!-- Columna Derecha: Contenido principal (Actividad / Ejercicios recientes) -->
      <main class="gh-content">
        <div class="section-header">
          <h2>Ejercicios Resueltos Recientes</h2>
          <span class="count-badge">{{ solvedProblems().length }}</span>
        </div>

        @if (solvedProblems().length === 0) {
          <div class="empty-state">
            <mat-icon>code_off</mat-icon>
            <p>Aún no tienes ejercicios marcados como <strong>Resuelto</strong>.</p>
          </div>
        } @else {
          <div class="repo-grid">
            @for (item of solvedProblems(); track item.id || item.titulo) {
              <div class="repo-card">
                <div class="repo-header">
                  <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="repo-title">
                    <mat-icon class="icon-link">bookmark_border</mat-icon>
                    {{ item.titulo }}
                  </a>
                  <span class="status-pill">Resuelto</span>
                </div>

                <p class="repo-desc">
                  Plataforma: <strong>{{ item.plataforma }}</strong>
                  @if (item.dificultad) {
                    <span> &bull; Dificultad: {{ item.dificultad }}</span>
                  }
                </p>

                <div class="repo-footer">
                  @if (item.tag) {
                    <span class="lang-tag">{{ item.tag }}</span>
                  }
                  @if (item.url) {
                    <a [href]="item.url" target="_blank" rel="noopener noreferrer" class="view-link">
                      Abrir URL del problema &rarr;
                    </a>
                  }
                </div>
              </div>
            }
          </div>
        }
      </main>
    </div>
`,
styleUrl: './profile-page.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private problemsService = inject(ProblemsService);
  // 1. Llamamos a listResource pidiendo únicamente los resueltos
  private resueltosResource = this.problemsService.listResource(() => ({
    plataforma: '',
    estado: 'Resuelto',
    tag: ''
  }));

  // 2. Extraemos el arreglo reactivo usando computed
  solvedProblems = computed(() => this.resueltosResource.value() || []);
  }
