import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar class="site-header">
      <a class="site-brand" routerLink="/" aria-label="ICPC Tracker, inicio">
        <span class="site-brand-mark" aria-hidden="true">&lt;/&gt;</span>
        <span>ICPC <strong>Tracker</strong></span>
      </a>
      <span class="spacer"></span>
      <nav class="site-nav" aria-label="Navegación principal">
        @if (auth.isLoggedIn()) {
          <a class="nav-link" routerLink="/problemas" routerLinkActive="active" ariaCurrentWhenActive="page">Problemas</a>
          <a class="nav-link" routerLink="/estadisticas" routerLinkActive="active" ariaCurrentWhenActive="page">Estadísticas</a>
          <a class="nav-link" [routerLink]="['/perfil']" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">{{ auth.username() }}</a>
          <button class="logout-link" type="button" (click)="auth.logout()">Salir</button>
        } @else {
          <a class="nav-link" routerLink="/login" routerLinkActive="active" ariaCurrentWhenActive="page">Entrar</a>
          <a class="nav-link" routerLink="/registro" routerLinkActive="active" ariaCurrentWhenActive="page">Registro</a>
        }
      </nav>
    </mat-toolbar>
    <router-outlet />
  `,
  styleUrl: './app.css',
})
export class App {
  auth = inject(AuthService);
}