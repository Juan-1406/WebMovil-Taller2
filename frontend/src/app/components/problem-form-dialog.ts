import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ESTADOS, Estado, PLATAFORMAS, Problem, ProblemInput } from '../models/problem';

@Component({
  selector: 'app-problem-form-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar problema' : 'Nuevo problema' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Título</mat-label>
          <input matInput formControlName="titulo" />
          @if (form.controls.titulo.hasError('required')) {
            <mat-error>El título es obligatorio</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Plataforma</mat-label>
          <mat-select formControlName="plataforma">
            @for (p of plataformas; track p) {
              <mat-option [value]="p">{{ p }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Dificultad (rating)</mat-label>
          <input matInput type="number" formControlName="dificultad" />
          @if (form.controls.dificultad.invalid) {
            <mat-error>Debe estar entre 0 y 4000</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            @for (e of estados; track e) {
              <mat-option [value]="e">{{ e }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tag (tema)</mat-label>
          <input matInput formControlName="tag" placeholder="Ej: DP, Grafos, Greedy" />
          @if (form.controls.tag.hasError('maxlength')) {
            <mat-error>Máximo 50 caracteres</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>URL</mat-label>
          <input matInput formControlName="url" placeholder="https://..." />
          @if (form.controls.url.invalid) {
            <mat-error>Debe comenzar con http:// o https://</mat-error>
          }
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form { display: flex; flex-direction: column; min-width: 280px; }
  `,
})
export class ProblemFormDialog {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<ProblemFormDialog>);
  data = inject<Problem | null>(MAT_DIALOG_DATA);

  plataformas = PLATAFORMAS;
  estados = ESTADOS;

  form = this.fb.nonNullable.group({
    titulo: [this.data?.titulo ?? '', [Validators.required, Validators.maxLength(150)]],
    plataforma: [this.data?.plataforma ?? 'Codeforces', Validators.required],
    dificultad: [this.data?.dificultad ?? (null as number | null), [Validators.min(0), Validators.max(4000)]],
    estado: [(this.data?.estado ?? 'Pendiente') as Estado, Validators.required],
    tag: [this.data?.tag ?? '', [Validators.maxLength(50)]],
    url: [this.data?.url ?? '', Validators.pattern(/^(https?:\/\/.+)?$/)],
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();

    const result: ProblemInput = {
      ...v,
      tag: v.tag.trim() || null,
      url: v.url.trim() || null,
    };
    this.ref.close(result);
  }
}