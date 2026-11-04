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
        <mat-spinner diameter="40" />
      } @else {
        <div class="cards">
          <mat-card><mat-card-content><h2>{{ total() }}</h2>Total</mat-card-content></mat-card>
          <mat-card><mat-card-content><h2>{{ resueltos() }}</h2>Resueltos</mat-card-content></mat-card>
          <mat-card><mat-card-content><h2>{{ pendientes() }}</h2>Pendientes</mat-card-content></mat-card>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 900px; margin: 0 auto; padding: 16px; }
    .cards { display: flex; gap: 12px; flex-wrap: wrap; }
    mat-card { flex: 1; min-width: 140px; text-align: center; padding: 8px; }
  `,
})
export class StatsPage {
  problems = inject(ProblemsService).listResource(() => ({ plataforma: '', estado: '' }));

  total = computed(() => this.problems.value()?.length ?? 0);
  resueltos = computed(() => this.problems.value()?.filter((p) => p.estado === 'Resuelto').length ?? 0);
  pendientes = computed(() => this.problems.value()?.filter((p) => p.estado === 'Pendiente').length ?? 0);
}