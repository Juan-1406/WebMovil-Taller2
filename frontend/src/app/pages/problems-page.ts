import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion'; // <-- IMPORTANTE: Nuevo módulo
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProblemsService } from '../services/problems.service';
import { ESTADOS, PLATAFORMAS, Problem, ProblemInput } from '../models/problem';
import { ProblemFormDialog } from '../components/problem-form-dialog';
import { ConfirmDialog } from '../components/confirm-dialog';
import { computed } from '@angular/core'; 

@Component({
  selector: 'app-problems-page',
  imports: [
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatCheckboxModule, 
    MatExpansionModule, 
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-grid">
      
      <!-- Arriba a la izquierda: Título -->
      <h1 class="page-title">Mis problemas</h1>

      <!-- Arriba a la derecha: Botón Agregar -->
      <div class="page-actions">
        <button mat-flat-button color="primary" (click)="openForm()">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>

      <!-- Izquierda: Filtros estilo Acordeón -->
      <aside class="sidebar-filters">
        
        <!-- mat-accordion gestiona que solo 1 panel esté abierto a la vez -->
        <mat-accordion>
          
          <!-- Sección Plataforma (abierta por defecto) -->
          <mat-expansion-panel expanded="true" class="custom-panel">
            <mat-expansion-panel-header>
              <mat-panel-title class="filter-title">Plataforma</mat-panel-title>
            </mat-expansion-panel-header>
            <div class="filter-options">
              <mat-checkbox 
                [checked]="plataforma() === ''" 
                (change)="$event.checked ? plataforma.set('') : null">
                Todas
              </mat-checkbox>
              @for (p of plataformas; track p) { 
                <mat-checkbox 
                  [checked]="plataforma() === p" 
                  (change)="$event.checked ? plataforma.set(p) : plataforma.set('')">
                  {{ p }}
                </mat-checkbox> 
              }
            </div>
          </mat-expansion-panel>

          <!-- Sección Estado -->
          <mat-expansion-panel class="custom-panel">
            <mat-expansion-panel-header>
              <mat-panel-title class="filter-title">Estado</mat-panel-title>
            </mat-expansion-panel-header>
            <div class="filter-options">
              <mat-checkbox 
                [checked]="estado() === ''" 
                (change)="$event.checked ? estado.set('') : null">
                Todos
              </mat-checkbox>
              @for (e of estados; track e) { 
                <mat-checkbox 
                  [checked]="estado() === e" 
                  (change)="$event.checked ? estado.set(e) : estado.set('')">
                  {{ e }}
                </mat-checkbox> 
              }
            </div>
          </mat-expansion-panel>

          <!-- Sección Tag -->
          <mat-expansion-panel class="custom-panel">
            <mat-expansion-panel-header>
              <mat-panel-title class="filter-title">Tag</mat-panel-title>
            </mat-expansion-panel-header>
            <div class="filter-options">
              <mat-checkbox 
                [checked]="tag() === ''" 
                (change)="$event.checked ? tag.set('') : null">
                Todos
              </mat-checkbox>
              @for (t of tags.value() ?? []; track t) { 
                <mat-checkbox 
                  [checked]="tag() === t" 
                  (change)="$event.checked ? tag.set(t) : tag.set('')">
                  {{ t }}
                </mat-checkbox> 
              }
            </div>
          </mat-expansion-panel>

        </mat-accordion>

        <!-- Botón Limpiar -->
        <button class="btn-yellow" (click)="plataforma.set(''); estado.set(''); tag.set('')">
          Limpiar filtros
        </button>

      </aside>

      <!-- Centro: Tabla de problemas -->
      <main class="main-content">
        @if (problems.isLoading()) {
          <div class="center"><mat-spinner diameter="40" /></div>
        } @else if (problems.error()) {
          <p class="center">No se pudieron cargar los problemas.</p>
        } @else if (problems.value()?.length === 0) {
          <p class="center">No hay problemas con estos filtros. ¡Agrega el primero!</p>
        } @else {
          <div class="table-wrap mat-elevation-z2">
            <table mat-table [dataSource]="problems.value() ?? []">
              <ng-container matColumnDef="titulo">
                <th mat-header-cell *matHeaderCellDef>Título</th>
                <td mat-cell *matCellDef="let p">
                  @if (p.url) { <a [href]="p.url" target="_blank">{{ p.titulo }}</a> }
                  @else { <span>{{ p.titulo }}</span> }
                </td>
              </ng-container>
              
              <ng-container matColumnDef="plataforma">
                <th mat-header-cell *matHeaderCellDef>Plataforma</th>
                <td mat-cell *matCellDef="let p">{{ p.plataforma }}</td>
              </ng-container>
              
              <ng-container matColumnDef="dificultad">
                <th mat-header-cell *matHeaderCellDef>Dificultad</th>
                <td mat-cell *matCellDef="let p">{{ p.dificultad ?? '-' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="tag">
                <th mat-header-cell *matHeaderCellDef>Tag</th>
                <td mat-cell *matCellDef="let p">{{ p.tag ?? '-' }}</td>
              </ng-container>
              
              <ng-container matColumnDef="estado">
                <th mat-header-cell *matHeaderCellDef>Estado</th>
                <td mat-cell *matCellDef="let p">{{ p.estado }}</td>
              </ng-container>
              
              <ng-container matColumnDef="acciones">
                <th mat-header-cell *matHeaderCellDef></th>
                <td mat-cell *matCellDef="let p" class="actions-cell">
                  <button mat-icon-button color="primary" (click)="openForm(p)"><mat-icon>edit</mat-icon></button>
                  <button mat-icon-button color="warn" (click)="remove(p)"><mat-icon>delete</mat-icon></button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="columns"></tr>
              <tr mat-row *matRowDef="let row; columns: columns"></tr>
            </table>
          </div>
        }
      </main>

      <!-- Derecha: Historial Timeline tipo GitHub) -->
      <aside class="right-sidebar">
        <div class="timeline-widget">
          <h3 class="timeline-header">Actividad reciente</h3>
          
          <div class="timeline">
            @for (act of actividadReciente(); track act.titulo) {
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <span class="timeline-time">{{ act.tiempo }}</span>
                  <p class="timeline-text">
                    Resuelto: <strong>{{ act.titulo }}</strong> en {{ act.plataforma }}
                  </p>
                </div>
              </div>
            }
          </div>
          
          <a href="#" class="timeline-link">Ver todo el historial &rarr;</a>
        </div>
      </aside>

    </div>
  `,
  styleUrl: './problems-page.css'
})
export class ProblemsPage {
  private service = inject(ProblemsService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  plataforma = signal('');
  estado = signal('');
  tag = signal('');

  plataformas = PLATAFORMAS;
  estados = ESTADOS;
  columns = ['titulo', 'plataforma', 'dificultad', 'tag', 'estado', 'acciones'];

  problems = this.service.listResource(() => ({
    plataforma: this.plataforma(),
    estado: this.estado(),
    tag: this.tag(),
  }));
  tags = this.service.tagsResource();

  actividadReciente = computed(() => {
    const todosLosProblemas = this.problems.value() ?? [];
    
    // Hacemos una copia, invertimos el orden para ver los últimos creados y tomamos solo 5
    const ultimos = [...todosLosProblemas].reverse().slice(0, 5);

    return ultimos.map(p => ({
      titulo: p.titulo,
      plataforma: p.plataforma,
      estado: p.estado,
      tiempo: p.estado === 'Resuelto' ? '¡Completado!' : 'Agregado'
    }));
  });

  openForm(problem?: Problem) {
    this.dialog
      .open(ProblemFormDialog, { data: problem ?? null })
      .afterClosed()
      .subscribe((value?: ProblemInput) => {
        if (!value) return;
        const request$ = problem
          ? this.service.update(problem.id, value)
          : this.service.create(value);
        request$.subscribe({
          next: () => {
            this.snack.open(problem ? 'Problema actualizado' : 'Problema agregado', 'OK', { duration: 3000 });
            this.problems.reload();
            this.tags.reload();
          },
          error: () => this.snack.open('Error al guardar', 'Cerrar', { duration: 4000 }),
        });
      });
  }

  remove(problem: Problem) {
    this.dialog
      .open(ConfirmDialog, { data: `¿Eliminar "${problem.titulo}"?` })
      .afterClosed()
      .subscribe((ok) => {
        if (!ok) return;
        this.service.remove(problem.id).subscribe({
          next: () => {
            this.snack.open('Problema eliminado', 'OK', { duration: 3000 });
            this.problems.reload();
            this.tags.reload();
          },
          error: () => this.snack.open('Error al eliminar', 'Cerrar', { duration: 4000 }),
        });
      });
  }
}