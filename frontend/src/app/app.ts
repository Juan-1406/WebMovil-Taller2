import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar>
      <span>ICPC Tracker</span>
      <span class="spacer"></span>
      @if (auth.isLoggedIn()) {
        <a mat-button routerLink="/problemas">Problemas</a>
        <a mat-button routerLink="/estadisticas">Estadísticas</a>
        <span class="user">{{ auth.username() }}</span>
        <button mat-button (click)="auth.logout()">Salir</button>
      } @else {
        <a mat-button routerLink="/login">Entrar</a>
        <a mat-button routerLink="/registro">Registro</a>
      }
    </mat-toolbar>
    <router-outlet />
  `,
  styles: `
    .spacer { flex: 1; }
    .user { margin: 0 8px; font-size: 14px; }
  `,
})
export class App {
  auth = inject(AuthService);
}