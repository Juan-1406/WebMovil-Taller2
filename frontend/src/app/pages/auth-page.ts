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
    <section class="auth-layout">
      <aside class="welcome-panel" aria-label="Acerca de ICPC Tracker">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <span>ICPC <strong>Tracker</strong></span>
        </div>

        <div class="welcome-copy">
          <p class="eyebrow">TU ESPACIO DE ENTRENAMIENTO</p>
          <h2>Cada problema es un paso adelante.</h2>
          <p>
            Organiza tus desafíos, practica algoritmos y sigue tu progreso
            en programación competitiva.
          </p>
        </div>

        <ul class="features">
          <li><span class="feature-dot" aria-hidden="true"></span>Registra problemas y su estado</li>
          <li><span class="feature-dot" aria-hidden="true"></span>Organiza tus ejercicios por etiquetas</li>
          <li><span class="feature-dot" aria-hidden="true"></span>Visualiza tus estadísticas de entrenamiento</li>
        </ul>

        <p class="welcome-footer">Codeforces · LeetCode · CSES</p>
      </aside>

      <div class="form-panel">
        <mat-card class="card">
          <mat-card-content>
            <div class="form-heading">
              <p class="form-eyebrow">ICPC TRACKER</p>
              <h1>{{ isRegister ? 'Crea tu cuenta' : 'Bienvenido Nuevamente' }}</h1>
              <p>
                {{ isRegister
                  ? 'Regístrate para comenzar a organizar tu entrenamiento.'
                  : 'Inicia sesión para continuar con tu entrenamiento.' }}
              </p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="form">
              <mat-form-field appearance="outline">
                <mat-label>Usuario</mat-label>
                <input matInput formControlName="username" autocomplete="username" />
                @if (form.controls.username.hasError('required')) {
                  <mat-error>El usuario es obligatorio</mat-error>
                } @else if (form.controls.username.hasError('minlength')) {
                  <mat-error>Mínimo 3 caracteres</mat-error>
                }
              </mat-form-field>

              @if (isRegister) {
                <mat-form-field appearance="outline">
                  <mat-label>Email</mat-label>
                  <input matInput type="email" formControlName="email" autocomplete="email" />
                  @if (form.controls.email.hasError('required')) {
                    <mat-error>El email es obligatorio</mat-error>
                  } @else if (form.controls.email.hasError('email')) {
                    <mat-error>Email inválido</mat-error>
                  }
                </mat-form-field>
              }

              <mat-form-field appearance="outline">
                <mat-label>Contraseña</mat-label>
                <input
                  matInput
                  type="password"
                  formControlName="password"
                  [attr.autocomplete]="isRegister ? 'new-password' : 'current-password'"
                />
                @if (form.controls.password.hasError('required')) {
                  <mat-error>La contraseña es obligatoria</mat-error>
                } @else if (form.controls.password.hasError('minlength')) {
                  <mat-error>Mínimo 6 caracteres</mat-error>
                }
              </mat-form-field>

              <button mat-flat-button class="submit-btn" type="submit" [disabled]="loading()">
                @if (loading()) {
                  <mat-spinner diameter="20" aria-label="Procesando" />
                } @else {
                  {{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}
                }
              </button>
            </form>

            <p class="switch-auth">
              @if (isRegister) {
                ¿Ya tienes una cuenta?
                <a routerLink="/login">Inicia sesión</a>
              } @else {
                ¿Aún no tienes cuenta?
                <a routerLink="/registro">Regístrate</a>
              }
            </p>
          </mat-card-content>
        </mat-card>
      </div>
    </section>
  `,
  styleUrl: './auth-page.css',
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