import { Routes } from '@angular/router';

export const MEDICO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/agenda-medico/agenda-medico.component').then(m => m.AgendaMedicoComponent)
  }
];