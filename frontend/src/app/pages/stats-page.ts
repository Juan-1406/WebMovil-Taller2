import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProblemsService } from '../services/problems.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-stats-page',
  imports: [MatCardModule, MatProgressSpinnerModule, MatProgressBarModule],
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

        <mat-card class="progress-card">
          <mat-card-content>
            <div class="progress-heading">
              <div>
                <h2 class="progress-tittle">Progreso de resolución</h2>
                <p class="progress-description">Porcentaje de problemas que has resuelto</p>
              </div>

              <span class="progress-percent">{{porcentajeResueltos()}}%</span>
            </div>

            <mat-progress-bar mode="determinate" [value] = "porcentajeResueltos()" 
            aria-label="Porcentaje de problemas resueltos"></mat-progress-bar>

            <p class="progress-caption">
              @if (total() === 0) {
                Aún no tienes problemas registrados.
              } @else {
                {{resueltos()}} de {{total()}}
                problemas resueltos  
              }
            </p>
          </mat-card-content>
        </mat-card>

        <mat-card class="plataformas-card">
          <mat-card-content>
            <h2 class="plataformas-title">Rendimiento por Plataformas</h2>
            <p class="plataformas-description">
              Revisa cuántos problemas has registrado y resuelto en cada plataforma.
            </p>

            @if (resumenPlataformas().length === 0) {
              <p class="plataformas-empty">
                Todavía no tienes problemas registrados.
                Agrega problemas para ver tus estadísticas.
              </p>
            } @else {
              <div class="plataformas-list">
                @for (
                  item of resumenPlataformas();
                  track item.plataforma
                ) {
                  <div class="plataformas-item">
                    <div class="plataforma-info">
                      <div>
                        <h3>{{item.plataforma}}</h3>
                        <p>{{item.resueltos}} resueltos de {{item.total}} registrados</p>
                      </div>

                      <span class="plataforma-percent">{{item.porcentaje}}%</span>
                    </div>

                    <mat-progress-bar mode="determinate" [value]="item.porcentaje"
                    [attr.aria-label]="'Porcentaje resuelto en ' + item.plataforma">
                    </mat-progress-bar>
                  </div>
                }
              </div>
            }
          </mat-card-content>
        </mat-card>
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

    .progress-card {margin-top: 20px; border-radius: 16px;
    1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface-container-low);
    box-shadow: none;}

    /* Encabezado del indicador */
    .progress-heading {display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 20px;}
    .progress-card .progress-title {margin: 0 0 6px; font-size: 18px; font-weight: 600; line-height: 1.4; color: var(--mat-sys-on-surface);}
    .progress-description {margin: 0; font-size: 14px; color: var(--mat-sys-on-surface-variant);}

    /* Porcentaje destacado */
    .progress-percent {font-size: 30px; font-weight: 700; color: var(--mat-sys-primary); white-space: nowrap;}

    /* Texto inferior */
    .progress-caption {margin: 16px 0 0; font-size: 13px; color: var(--mat-sys-on-surface-variant);}

    /* Adaptación a pantallas pequeñas */
    @media (max-width: 520px) {.progress-heading {align-items: flex-start; gap: 12px;}
      .progress-percent {font-size: 24px;} .progress-card mat-card-content {padding: 18px;}
    }

    .plataformas-card {margin-top: 20px; border-radius: 16px; border: 1px solid var(--mat-sys-outline-variant); background: var(--mat-sys-surface-container-low); box-shadow: none;}
    .plataformas-card mat-card-content {padding: 24px; text-align: left;}
    .plataformas-title {font-size: 18px; font-weight: 600; margin: 0 0 8px; color: var(--mat-sys-on-surface);}
    .plataformas-description {margin: 0 0 24px; font-size: 14px; color: var(--mat-sys-on-surface-variant);}
    .plataformas-list {display: grid;gap: 24px;}
    .plataforma-info {display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 12px;}
    .plataforma-info h3 {font-size: 15px; font-weight: 600; margin: 0 0 4px;}
    .plataforma-info p {font-size: 13px; margin: 0; color: var(--mat-sys-on-surface-variant);}
    .plataforma-percent {font-size: 20px; font-weight: 600; color: var(--mat-sys-primary); white-space: nowrap;}
    .plataformas-empty {text-align: center; padding: 24px 12px; color: var(--mat-sys-on-surface-variant);}

    @media (max-width: 520px) {.plataformas-card mat-card-content {padding: 18px;} .plataforma-percent {font-size: 18px;}
}

  `,
})

export class StatsPage {
  private service = inject(ProblemsService);

  problems = this.service.listResource(() => ({plataforma: '', estado: '',}));

  total = computed(() => this.problems.value()?.length ?? 0);
  resueltos = computed(() => this.problems.value()?.filter((p) => p.estado === 'Resuelto').length ?? 0);
  pendientes = computed(() => this.problems.value()?.filter((p) => p.estado === 'Pendiente').length ?? 0);
  intentando = computed(() => this.problems.value()?.filter((p) => p.estado === 'Intentando').length ?? 0);

  porcentajeResueltos = computed(() => {
    const total = this.total();

    if (total === 0) {
      return 0;
    }
    return Math.round((this.resueltos()/ total) * 100);
  });

  resumenPlataformas = computed(() => {
    const problemas = this.problems.value() ?? [];
    const plataformas = new Map<string, {plataforma: string; total: number; resueltos: number;}>();

    //Agrupar problemas según plataforma
    for (const problema of problemas) {
      const nombre = problema.plataforma.trim() || 'Sin plataforma';

      if (!plataformas.has(nombre)) {
        plataformas.set(nombre, {plataforma: nombre, total: 0, resueltos: 0});
      }

      const grupo = plataformas.get(nombre)!;
      grupo.total++;

      if (problema.estado === 'Resuelto') {
        grupo.resueltos++;
      }
    }

    //Calcular porcentaje resuelto de cada plataforma
    return Array.from(plataformas.values()).map((grupo) => ({
      ...grupo, porcentaje: Math.round((grupo.resueltos / grupo.total) * 100),})
      ).sort((a, b) => b.total - a.total || a.plataforma.localeCompare(b.plataforma));
    });
}