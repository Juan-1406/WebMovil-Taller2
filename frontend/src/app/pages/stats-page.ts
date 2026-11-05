import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemsService } from '../services/problems.service';

@Component({
  selector: 'app-stats-page',
  imports: [MatCardModule, MatProgressSpinnerModule],
  template: `
    <div class="page">
      <h1>Estadísticas</h1>

      @if (problems.isLoading()) {
        <div claass="center">
          <mat-spinner diameter="40" />
        </div>
      } @else if (problems.error()) {
        <p class="error" role="alert">
          No se pudieron cargar las estadísticas.
          Comprueba la conexión e intenta nuevamente.
        </p>
      } @else {
        <div class="cards">
          <mat-card><mat-card-content><h2>{{ total() }}</h2>Total</mat-card-content></mat-card>
          <mat-card><mat-card-content><h2>{{ resueltos() }}</h2>Resueltos</mat-card-content></mat-card>
          <mat-card><mat-card-content><h2>{{ intentando() }}</h2>Intentando</mat-card-content></mat-card>
          <mat-card><mat-card-content><h2>{{ pendientes() }}</h2>Pendientes</mat-card-content></mat-card>
        </div>
      }
    </div>
  `,
  styles: `
    .page {max-width: 1100px; margin: 0 auto; padding: 24px;}
    .page h1 {font-size: 28px; font-weight: 600; margin-bottom: 24px;}

    /* Distribucion de las tarjetas */
    .cards {display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px;}

    /* Apariencia de cada tarjeta */
    mat-card {min-width: 0; border-radius: 16px; border: 1px solid var(--mat-sys-outline-variant);
            background: var(--mat-sys-surface-container-low); box-shadow: none; transition: transform 0.2s ease, box-shadow 0.2s ease;}

    mat-card:hover {transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);}
    mat-card mat-card-content {padding: 24px; text-align: center;}

    /* Numeros de las estadisticas */
    mat-card h2 {font-size: 36px; font-weight: 700; line-height: 1.2; margin: 0 0 12px; color: var(--mat-sys-primary);}

    /* Estados de carga y error */
    .center {display: flex; justify-content: center; padding: 32px;}
    .error {text-align: center; padding: 24px;}

    /* Tablets */
    @media (max-width: 900px) {.cards {grid-template-columns: repeat(2, minmax(0, 1fr));}}

    /* Telefonos */
    @media (max-width: 520px) {.page {padding: 16px;} .cards {grid-template-columns: 1fr;}}
  `,
})

export class StatsPage {
  private service = inject(ProblemsService);

  problems = this.service.listResource(() => ({plataforma: '', estado: '',}));

  total = computed(() => this.problems.value()?.length ?? 0);
  resueltos = computed(() => this.problems.value()?.filter((p) => p.estado === 'Resuelto').length ?? 0);
  pendientes = computed(() => this.problems.value()?.filter((p) => p.estado === 'Pendiente').length ?? 0);
  intentando = computed(() => this.problems.value()?.filter((p) => p.estado === 'Intentando').length ?? 0);
}