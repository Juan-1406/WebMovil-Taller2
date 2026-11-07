import { Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ProblemsService } from '../services/problems.service';

@Component({
  selector: 'app-stats-page',
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule,MatSelectModule,],
  template: `
    <main class="stats-page">
      <header class="stats-header">
        <div>
          <h1>Estadísticas</h1>
          <p>Resumen de tu progreso en programación competitiva.</p>
        </div>

        <mat-form-field appearance="outline" class="platform-filter" subscriptSizing="dynamic">
          <mat-label>Plataforma</mat-label>
          <mat-select [value]="plataformaSeleccionada()" (selectionChange)="plataformaSeleccionada.set($event.value)">
            <mat-option value="">Todas las plataformas</mat-option>
            @for (plataforma of plataformasDisponibles(); track plataforma) {
              <mat-option [value]="plataforma">{{ plataforma }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </header>

      @if (problems.isLoading()) {
        <div class="feedback" role="status">
          <mat-spinner diameter="38" aria-label="Cargando estadísticas" />
          <span>Cargando estadísticas...</span>
        </div>
      } @else if (problems.error()) {
        <div class="feedback error" role="alert">
          <p>No se pudieron cargar las estadísticas. Revisa la conexión con el backend.</p>
          <button type="button" (click)="problems.reload()">Reintentar</button>
        </div>
      } @else {
        <section class="overview" aria-label="Resumen de estadísticas">
          <mat-card class="progress-card">
            <mat-card-content>
              <div class="donut" role="img" [attr.aria-label]="porcentajeResueltos() + '% de problemas resueltos'">
                <svg viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="48" class="donut-track" />
                  <circle cx="60" cy="60" r="48" class="donut-value" pathLength="100" [attr.stroke-dasharray]="porcentajeResueltos() + ' 100'" />
                </svg>
                <strong>{{porcentajeResueltos()}}%</strong>
              </div>
              <div class="progress-text">
                <h2>Progreso general</h2>
                <p>
                  @if (total() === 0) {
                    Aún no tienes problemas registrados.
                  } @else {
                    {{resueltos()}} de {{total()}} problemas resueltos
                  }
                </p>
              </div>
            </mat-card-content>
          </mat-card>

          <div class="metrics" aria-label="Indicadores principales">
            <mat-card class="metric-card metric-total">
              <mat-card-content>
                <span class="metric-icon"><mat-icon>layers</mat-icon></span>
                <strong>{{total()}}</strong>
                <span>Total</span>
              </mat-card-content>
            </mat-card>
            <mat-card class="metric-card metric-solved">
              <mat-card-content>
                <span class="metric-icon"><mat-icon>check_circle</mat-icon></span>
                <strong>{{resueltos()}}</strong>
                <span>Resueltos</span>
              </mat-card-content>
            </mat-card>
            <mat-card class="metric-card metric-attempting">
              <mat-card-content>
                <span class="metric-icon"><mat-icon>autorenew</mat-icon></span>
                <strong>{{intentando()}}</strong>
                <span>Intentando</span>
              </mat-card-content>
            </mat-card>
            <mat-card class="metric-card metric-pending">
              <mat-card-content>
                <span class="metric-icon"><mat-icon>schedule</mat-icon></span>
                <strong>{{pendientes()}}</strong>
                <span>Pendientes</span>
              </mat-card-content>
            </mat-card>
          </div>
        </section>

        <section class="details" aria-label="Estadísticas detalladas">
          <mat-card class="details-card">
            <mat-card-content>
              <h2>Rendimiento por plataforma</h2>
              @if (resumenPlataformas().length === 0) {
                <p class="empty">No hay problemas registrados para esta selección.</p>
              } @else {
                <div class="platform-list">
                  @for (item of resumenPlataformas(); track item.plataforma) {
                    <div class="platform-item">
                      <div class="platform-heading">
                        <h3>{{ item.plataforma }}</h3>
                        <strong>{{ item.porcentaje }}%</strong>
                      </div>
                      <mat-progress-bar mode="determinate" [value]="item.porcentaje" [attr.aria-label]="'Problemas resueltos de ' + item.plataforma" />
                      <p>{{item.resueltos}} de {{item.total}} resueltos</p>
                    </div>
                  }
                </div>
              }
            </mat-card-content>
          </mat-card>

          <mat-card class="details-card">
            <mat-card-content>
              <h2>Etiquetas más frecuentes</h2>
              @if (resumenEtiquetas().length === 0) {
                <p class="empty">Aún no hay etiquetas para mostrar.</p>
              } @else {
                <div class="tags-list">
                  @for (item of resumenEtiquetas(); track item.etiqueta) {
                    <div class="tag-row">
                      <span class="tag-name">
                        <mat-icon aria-hidden="true">sell</mat-icon>
                        {{item.etiqueta}}
                      </span>
                      <strong>{{ item.total }}</strong>
                    </div>
                  }
                </div>
              }
            </mat-card-content>
          </mat-card>
        </section>
      }
    </main>
  `,
  styles: `
    .stats-page {max-width: 1100px; margin: 0 auto; padding: 28px 24px 52px;}
    .stats-header {display: flex; justify-content: space-between; align-items: start; gap: 20px; margin-bottom: 20px;}
    h1 {margin: 0 0 5px; font-size: 30px; font-weight: 700; color: #102143;}
    .stats-header p {margin: 0; color: #53627a; font-size: 14px;}
    .platform-filter {width: 245px; flex-shrink: 0;}
    .overview {display: grid; grid-template-columns: minmax(290px, 1.3fr) minmax(0, 2fr); gap: 14px;}
    mat-card {min-width: 0; border-radius: 15px; border: 1px solid #dce5f2; background: #fff; box-shadow: 0 4px 14px rgba(18, 49, 99, .05);}
    mat-card mat-card-content {padding: 20px;}
    .progress-card mat-card-content {min-height: 152px; display: flex; align-items: center; gap: 18px;}
    .donut {width: 146px; height: 146px; position: relative; flex-shrink: 0; display: grid; place-items: center;}
    .donut svg {width: 100%; height: 100%; transform: rotate(-90deg);}
    .donut circle {fill: none; stroke-width: 12;}
    .donut-track {stroke: #d9e4f7;}
    .donut-value {stroke: #0b5bd3; stroke-linecap: butt; transition: stroke-dasharray .25s ease;}
    .donut strong {position: absolute; font-size: 28px; font-weight: 750; color: #102143;}
    .progress-text h2 {margin: 0 0 8px; font-size: 18px; color: #102143;}
    .progress-text p {margin: 0; font-size: 14px; color: #53627a; line-height: 1.55;}
    .metrics {display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px;}
    .metric-card mat-card-content {height: 100%; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 7px; padding: 18px 8px; text-align: center;}
    .metric-card strong {font-size: 28px; line-height: 1; color: #102143;}
    .metric-card span:last-child {font-size: 13px; color: #30435c;}
    .metric-icon {width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: #e9f0ff; color: #095bdd;}
    .metric-icon mat-icon, .tag-name mat-icon {font-family: 'Material Symbols Outlined';}
    .metric-solved .metric-icon {background: #e2f7eb; color: #069653;}
    .metric-attempting .metric-icon {background: #e9f2ff; color: #226ce4;}
    .metric-pending .metric-icon {background: #fff2df; color: #d78a00;}
    .details {display: grid; grid-template-columns: 1.35fr 1fr; gap: 14px; margin-top: 16px;}
    .details-card mat-card-content {padding: 22px;}
    .details-card h2 {margin: 0 0 20px; font-size: 18px; color: #102143;}
    .platform-list {display: grid; gap: 20px;}
    .platform-heading {display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px;}
    .platform-heading h3 {font-size: 15px; margin: 0; color: #102143;}
    .platform-heading strong {color: #0b5bd3; font-size: 16px;}
    .platform-item p {margin: 8px 0 0; font-size: 13px; color: #53627a;}
    .platform-item mat-progress-bar {--mdc-linear-progress-active-indicator-color: #0b5bd3; --mdc-linear-progress-track-color: #dce6f7; border-radius: 8px; overflow: hidden;}
    .tags-list {display: grid; gap: 10px;}
    .tag-row {display: flex; align-items: center; justify-content: space-between; gap: 10px; border-radius: 10px; background: #f3f6fd; padding: 12px 14px;}
    .tag-name {display: flex; align-items: center; gap: 9px; min-width: 0; overflow-wrap: anywhere; font-size: 14px; color: #23436e;}
    .tag-name mat-icon {flex-shrink: 0; font-size: 20px; width: 20px; height: 20px; color: #0b5bd3;}
    .tag-row strong {flex-shrink: 0; color: #102143;}
    .empty {font-size: 14px; color: #53627a; line-height: 1.5;}
    .feedback {min-height: 150px; display: flex; align-items: center; justify-content: center; gap: 15px; color: #53627a;}
    .feedback.error {flex-direction: column; text-align: center;}
    .feedback button {border: 0; border-radius: 8px; padding: 10px 15px; background: #0b5bd3; color: #fff; cursor: pointer;}
    @media (max-width: 1000px) {.overview {grid-template-columns: 1fr;} .progress-card mat-card-content {min-height: 0;}}
    @media (max-width: 700px) {.details {grid-template-columns: 1fr;}}
    @media (max-width: 540px) {
      .stats-page {padding: 18px 14px 36px;}
      .stats-header {flex-direction: column; gap: 14px;}
      .platform-filter {width: 100%;}
      .metrics {grid-template-columns: repeat(2, minmax(0, 1fr));}
      .progress-card mat-card-content { gap: 8px; padding: 16px;}
      .donut {width: 112px; height: 112px;}
      .donut strong {font-size: 23px;}
      .progress-text h2 {font-size: 16px;}
    }
  `,
})

export class StatsPage {
  private service = inject(ProblemsService);

  problems = this.service.listResource(() => ({plataforma: '', estado: ''}));
  plataformaSeleccionada = signal('');

  plataformasDisponibles = computed(() => 
    [...new Set((this.problems.value() ?? []).map((p) => p.plataforma.trim() || 'Sin plataforma'))].sort((a, b) => a.localeCompare(b))
  );

  //El selector filtra únicamente las estadísticas
  problemasFiltrados = computed(() => {
    const plataforma = this.plataformaSeleccionada();
    const todos = this.problems.value() ?? [];
    return plataforma ? todos.filter((p) => (p.plataforma.trim() || 'Sin plataforma') === plataforma) : todos;
  });

  total = computed(() => this.problemasFiltrados().length);
  resueltos = computed(() => this.problemasFiltrados().filter((p) => p.estado === 'Resuelto').length);
  intentando = computed(() => this.problemasFiltrados().filter((p) => p.estado === 'Intentando').length);
  pendientes = computed(() => this.problemasFiltrados().filter((p) => p.estado === 'Pendiente').length);
  porcentajeResueltos = computed(() =>this.total() === 0 ? 0 : Math.round((this.resueltos() / this.total()) * 100));

  resumenPlataformas = computed(() => {
    const agrupadas = new Map<string, {plataforma: string; total: number; resueltos: number}>();
    for (const problema of this.problemasFiltrados()) {
      const nombre = problema.plataforma.trim() || 'Sin plataforma';
      if (!agrupadas.has(nombre)) {
        agrupadas.set(nombre, { plataforma: nombre, total: 0, resueltos: 0 });
      }
      const grupo = agrupadas.get(nombre)!;
      grupo.total++;
      if (problema.estado === 'Resuelto') grupo.resueltos++;
    }
    return [...agrupadas.values()].map((grupo) => ({
        ...grupo, porcentaje: Math.round((grupo.resueltos / grupo.total) * 100),
      })).sort((a, b) => b.total - a.total || a.plataforma.localeCompare(b.plataforma));
  });

  resumenEtiquetas = computed(() => {
    const etiquetas = new Map<string, number>();
    for (const problema of this.problemasFiltrados()) {
      const nombre = problema.tag?.trim();
      if (!nombre) continue;
      etiquetas.set(nombre, (etiquetas.get(nombre) ?? 0) + 1);
    }
    return [...etiquetas.entries()].map(([etiqueta, total]) => ({ etiqueta, total }))
      .sort((a, b) => b.total - a.total || a.etiqueta.localeCompare(b.etiqueta));
  });
}