import { Routes } from '@angular/router';

export const MEDICO_ROUTES: Routes = [
  {
    path: '', // URL: /medico (Pantalla Agenda Diaria por defecto)
    loadComponent: () => import('./pages/agenda-medico/agenda-medico.component').then(m => m.AgendaMedicoComponent)
  },
  {
    path: 'perfil', // URL: /medico/perfil (Pantalla configuración del médico)
    loadComponent: () => import('./pages/perfil-medico/perfil-medico.component').then(m => m.PerfilMedicoComponent)
  }
];