import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { AuthPage } from './pages/auth-page';
import { ProblemsPage } from './pages/problems-page';
import { StatsPage } from './pages/stats-page';

export const routes: Routes = [
  { path: '', redirectTo: 'problemas', pathMatch: 'full' },
  { path: 'login', component: AuthPage, data: { mode: 'login' } },
  { path: 'registro', component: AuthPage, data: { mode: 'registro' } },
  { path: 'problemas', component: ProblemsPage, canActivate: [authGuard] },
  { path: 'estadisticas', component: StatsPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'problemas' },
];