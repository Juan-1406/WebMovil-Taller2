import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-page',
  imports: [
    ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
  ],
  template: `
    <div class="wrap">
      <mat-card class="card">
        <mat-card-header>
          <mat-card-title>{{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="submit()" class="form">
            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="username" />
              @if (form.controls.username.hasError('required')) {
                <mat-error>El usuario es obligatorio</mat-error>
              } @else if (form.controls.username.hasError('minlength')) {
                <mat-error>Mínimo 3 caracteres</mat-error>
              }
            </mat-form-field>

            @if (isRegister) {
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput type="email" formControlName="email" />
                @if (form.controls.email.hasError('required')) {
                  <mat-error>El email es obligatorio</mat-error>
                } @else if (form.controls.email.hasError('email')) {
                  <mat-error>Email inválido</mat-error>
                }
              </mat-form-field>
            }

            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password" formControlName="password" />
              @if (form.controls.password.hasError('required')) {
                <mat-error>La contraseña es obligatoria</mat-error>
              } @else if (form.controls.password.hasError('minlength')) {
                <mat-error>Mínimo 6 caracteres</mat-error>
              }
            </mat-form-field>

            <button mat-flat-button type="submit" [disabled]="loading()">
              @if (loading()) { <mat-spinner diameter="20" /> } @else {
                {{ isRegister ? 'Registrarme' : 'Entrar' }}
              }
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          @if (isRegister) {
            <a mat-button routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
          } @else {
            <a mat-button routerLink="/registro">¿No tienes cuenta? Regístrate</a>
          }
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: `
    .wrap { display: flex; justify-content: center; padding: 24px 12px; }
    .card { width: 100%; max-width: 400px; padding: 8px; }
    .form { display: flex; flex-direction: column; gap: 4px; padding-top: 16px; }
  `,
})
export class AuthPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  isRegister = inject(ActivatedRoute).snapshot.data['mode'] === 'registro';
  loading = signal(false);

  form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', this.isRegister ? [Validators.required, Validators.email] : []],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    const { username, email, password } = this.form.getRawValue();

    const request$ = this.isRegister
      ? this.auth.register({ username, email, password }).pipe(
          switchMap(() => this.auth.login({ username, password })),
        )
      : this.auth.login({ username, password });

    request$.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/problemas']);
      },
      error: (err) => {
        this.loading.set(false);
        const detail = err.error?.detail;
        this.snack.open(typeof detail === 'string' ? detail : 'Datos inválidos', 'Cerrar', { duration: 4000 });
      },
    });
  }
}