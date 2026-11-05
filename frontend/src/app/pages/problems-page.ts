import { Component, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProblemsService } from '../services/problems.service';
import { ESTADOS, PLATAFORMAS, Problem, ProblemInput } from '../models/problem';
import { ProblemFormDialog } from '../components/problem-form-dialog';
import { ConfirmDialog } from '../components/confirm-dialog';

@Component({
  selector: 'app-problems-page',
  imports: [
    MatTableModule, MatButtonModule, MatIconModule, MatSelectModule,
    MatFormFieldModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="page">
      <div class="header">
        <h1>Mis problemas</h1>
        <button mat-flat-button (click)="openForm()">
          <mat-icon>add</mat-icon> Agregar
        </button>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Plataforma</mat-label>
          <mat-select [value]="plataforma()" (selectionChange)="plataforma.set($event.value)">
            <mat-option value="">Todas</mat-option>
            @for (p of plataformas; track p) { <mat-option [value]="p">{{ p }}</mat-option> }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select [value]="estado()" (selectionChange)="estado.set($event.value)">
            <mat-option value="">Todos</mat-option>
            @for (e of estados; track e) { <mat-option [value]="e">{{ e }}</mat-option> }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tag</mat-label>
          <mat-select [value]="tag()" (selectionChange)="tag.set($event.value)">
            <mat-option value="">Todos</mat-option>
            @for (t of tags.value() ?? []; track t) { <mat-option [value]="t">{{ t }}</mat-option> }
          </mat-select>
        </mat-form-field>
      </div>

      @if (problems.isLoading()) {
        <div class="center"><mat-spinner diameter="40" /></div>
      } @else if (problems.error()) {
        <p class="center">No se pudieron cargar los problemas.</p>
      } @else if (problems.value()?.length === 0) {
        <p class="center">No hay problemas con estos filtros. ¡Agrega el primero!</p>
      } @else {
        <div class="table-wrap">
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
              <td mat-cell *matCellDef="let p">
                <button mat-icon-button (click)="openForm(p)"><mat-icon>edit</mat-icon></button>
                <button mat-icon-button (click)="remove(p)"><mat-icon>delete</mat-icon></button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="columns"></tr>
            <tr mat-row *matRowDef="let row; columns: columns"></tr>
          </table>
        </div>
      }
    </div>
  `,
  styles: `
    .page { max-width: 900px; margin: 0 auto; padding: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; }
    .filters { display: flex; gap: 12px; flex-wrap: wrap; }
    .center { display: flex; justify-content: center; padding: 32px; }
    .table-wrap { overflow-x: auto; }
    table { width: 100%; }
  `,
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

  //Panel para solicitar confirmación antes de eliminar un problema
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