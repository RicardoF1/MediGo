import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'paciente',
    // Carga de forma perezosa todo el submódulo del paciente con su propia estructura interna
    loadChildren: () => import('./features/paciente/paciente.routes').then(m => m.PACIENTE_ROUTES)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];