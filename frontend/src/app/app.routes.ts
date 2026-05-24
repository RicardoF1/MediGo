import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'paciente',
    // Carga de forma perezosa todo el submódulo del paciente con su propia estructura interna
    loadChildren: () => import('./features/paciente/paciente.routes').then(m => m.PACIENTE_ROUTES)
  },
  {
    path: 'medico',
    loadChildren: () => import('./features/medico/medico.routes').then(m => m.MEDICO_ROUTES)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  },
];