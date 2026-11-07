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
  imports: [ReactiveFormsModule, RouterLink, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatProgressSpinnerModule,
  ],
  template: `
    <main class="auth-layout">
      <aside class="welcome-panel" aria-label="Acerca de ICPC Tracker">
        <div class="welcome-brand">
          <span class="welcome-brand-icon" aria-hidden="true">&lt;/&gt;</span>
          <span>ICPC <strong>Tracker</strong></span>
        </div>

        <div class="welcome-intro">
          <p class="welcome-eyebrow">TU ESPACIO DE ENTRENAMIENTO</p>
          <h2>Cada problema es un <span>paso adelante.</span></h2>
          <p class="welcome-description">
            Registra tus problemas, etiqueta tus ejercicios y sigue tu progreso
            en programación competitiva.
          </p>
        </div>

        <ul class="features">
          <li>
            <span class="feature-icon" aria-hidden="true">&lt;/&gt;</span>
            <span>Registra problemas y su estado</span>
          </li>
          <li>
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12.3 12.3 3H21v8.7L11.7 21a2 2 0 0 1-2.8 0L3 15.1a2 2 0 0 1 0-2.8Z"/>
                <circle cx="16.5" cy="7.5" r="1.3"/>
              </svg>
            </span>
            <span>Organiza tus ejercicios por etiquetas</span>
          </li>
          <li>
            <span class="feature-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 20V13h4v7M10 20V8h4v12M16 20V4h4v16"/>
              </svg>
            </span>
            <span>Visualiza tu progreso y estadísticas</span>
          </li>
        </ul>
      </aside>

      <section class="form-panel" aria-labelledby="auth-title">
        <mat-card class="auth-card">
          <mat-card-content>
            <div class="form-heading">
              <p class="form-eyebrow">ICPC TRACKER</p>
              <h1 id="auth-title">{{ isRegister ? '¡Crea tu cuenta!' : '¡Bienvenido de nuevo!' }}</h1>
              <p>
                {{ isRegister
                  ? 'Regístrate y comienza a organizar tu entrenamiento.'
                  : 'Inicia sesión para continuar con tu entrenamiento.' }}
              </p>
            </div>

            <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
              <div class="field-group">
                <label for="auth-username">Usuario</label>
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                  <span matPrefix class="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M4.5 21v-2.3a7.5 7.5 0 0 1 15 0V21h-15Z"/>
                    </svg>
                  </span>
                  <input id="auth-username" matInput formControlName="username" placeholder="Ingresa tu usuario" autocomplete="username" />
                  @if (form.controls.username.hasError('required')) {
                    <mat-error>El usuario es obligatorio</mat-error>
                  } @else if (form.controls.username.hasError('minlength')) {
                    <mat-error>Mínimo 3 caracteres</mat-error>
                  }
                </mat-form-field>
              </div>

              @if (isRegister) {
                <div class="field-group">
                  <label for="auth-email">Correo electrónico</label>
                  <mat-form-field appearance="outline" subscriptSizing="dynamic">
                    <span matPrefix class="field-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2"/>
                        <path d="m3 7 9 6 9-6"/>
                      </svg>
                    </span>
                    <input id="auth-email" matInput type="email" formControlName="email" placeholder="Ingresa tu correo" autocomplete="email" />
                    @if (form.controls.email.hasError('required')) {
                      <mat-error>El correo es obligatorio</mat-error>
                    } @else if (form.controls.email.hasError('email')) {
                      <mat-error>Ingresa un correo válido</mat-error>
                    }
                  </mat-form-field>
                </div>
              }

              <div class="field-group">
                <label for="auth-password">Contraseña</label>
                <mat-form-field appearance="outline" subscriptSizing="dynamic">
                  <span matPrefix class="field-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="5" y="10" width="14" height="11" rx="2"/>
                      <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
                      <circle cx="12" cy="15.5" r="1"/>
                      <path d="M12 16.5v1.5"/>
                    </svg>
                  </span>
                  <input
                    id="auth-password"
                    matInput
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Ingresa tu contraseña"
                    [attr.autocomplete]="isRegister ? 'new-password' : 'current-password'"
                  />
                  <button
                    type="button"
                    mat-icon-button
                    matSuffix
                    class="visibility-button"
                    (click)="showPassword.update(value => !value)"
                    [attr.aria-label]="showPassword() ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                    [attr.aria-pressed]="showPassword()"
                  >
                    @if (showPassword()) {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                        <path d="M9.9 5.3A10.7 10.7 0 0 1 12 5c5.2 0 9 4.3 10 7a11.9 11.9 0 0 1-3.1 4.4M6.1 6.1C3.9 7.6 2.5 10 2 12c1 2.7 4.8 7 10 7 1.5 0 2.9-.3 4.1-.8"/>
                      </svg>
                    } @else {
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                  @if (form.controls.password.hasError('required')) {
                    <mat-error>La contraseña es obligatoria</mat-error>
                  } @else if (form.controls.password.hasError('minlength')) {
                    <mat-error>Mínimo 6 caracteres</mat-error>
                  }
                </mat-form-field>
              </div>

              <button mat-flat-button class="submit-btn" type="submit" [disabled]="loading()">
                @if (loading()) {
                  <mat-spinner diameter="22" aria-label="Procesando" />
                } @else {
                  {{ isRegister ? 'Crear cuenta' : 'Iniciar sesión' }}
                }
              </button>
            </form>

            <p class="switch-auth">
              @if (isRegister) {
                ¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión</a>
              } @else {
                ¿Aún no tienes cuenta? <a routerLink="/registro">Regístrate</a>
              }
            </p>
          </mat-card-content>
        </mat-card>
      </section>
    </main>
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
  showPassword = signal(false);

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