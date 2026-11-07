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
  styles: [`
    .gh-container {
      max-width: 1200px;
      margin: 32px auto;
      padding: 0 24px;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 36px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
      box-sizing: border-box;
    }

    /* Columna izquierda / Sidebar */
    .gh-sidebar {
      display: flex;
      flex-direction: column;
    }
    .gh-avatar {
      width: 260px;
      height: 260px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0b3b60, #075df0);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 96px;
      font-weight: 700;
      border: 1px solid #d0d7de;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      margin-bottom: 16px;
    }
    .gh-fullname {
      font-size: 24px;
      line-height: 1.25;
      font-weight: 600;
      color: #1f2328;
      margin: 0;
    }
    .gh-username {
      font-size: 18px;
      font-weight: 300;
      line-height: 24px;
      color: #656d76;
      margin: 0 0 12px 0;
    }
    .gh-bio {
      font-size: 14px;
      color: #1f2328;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }
    .btn-logout {
      width: 100%;
      margin-bottom: 20px;
      border-radius: 6px;
      color: #cf222e !important;
      border-color: #d0d7de !important;
    }
    .btn-logout:hover {
      background-color: #ffebe9 !important;
    }
    .gh-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px solid #d0d7de;
      padding-top: 16px;
      font-size: 14px;
      color: #1f2328;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #656d76;
    }

    /* Columna derecha / Contenido */
    .gh-content {
      min-width: 0;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #d0d7de;
    }
    .section-header h2 {
      font-size: 16px;
      font-weight: 600;
      color: #1f2328;
      margin: 0;
    }
    .count-badge {
      background-color: #afb8c133;
      color: #1f2328;
      font-size: 12px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 10px;
    }

    /* Grid de tarjetas tipo repo */
    .repo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
    }
    .repo-card {
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 16px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: border-color 0.15s ease-in-out;
    }
    .repo-card:hover {
      border-color: #0969da;
    }
    .repo-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
    }
    .repo-title {
      font-size: 14px;
      font-weight: 600;
      color: #0969da;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      word-break: break-word;
    }
    .repo-title:hover {
      text-decoration: underline;
    }
    .icon-link {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #656d76;
    }
    .status-pill {
      font-size: 11px;
      font-weight: 500;
      color: #1a7f37;
      border: 1px solid #2da44e59;
      border-radius: 12px;
      padding: 1px 7px;
      background: #dafbe1;
      white-space: nowrap;
    }
    .repo-desc {
      font-size: 13px;
      color: #656d76;
      margin: 0 0 16px 0;
      line-height: 1.4;
    }
    .repo-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      color: #656d76;
      margin-top: auto;
    }
    .lang-tag {
      background-color: #ddf4ff;
      color: #0969da;
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: 500;
    }
    .view-link {
      color: #0969da;
      text-decoration: none;
      font-weight: 500;
      margin-left: auto;
    }
    .view-link:hover {
      text-decoration: underline;
    }

    .empty-state {
      padding: 40px;
      text-align: center;
      border: 1px dashed #d0d7de;
      border-radius: 6px;
      color: #656d76;
    }
    .empty-state mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
      color: #8c959f;
    }

    @media (max-width: 768px) {
      .gh-container {
        grid-template-columns: 1fr;
      }
      .gh-avatar {
        width: 120px;
        height: 120px;
        font-size: 48px;
      }
      .repo-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
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