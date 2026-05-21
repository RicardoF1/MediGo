import { Routes } from '@angular/router';

export const PACIENTE_ROUTES: Routes = [
  {
    path: '', // URL: /paciente (Muestra el Dashboard por defecto)
    loadComponent: () => import('./pages/dashboard-paciente/dashboard-paciente.component').then(m => m.DashboardPacienteComponent)
  },
  {
    path: 'reservar', // URL: /paciente/reservar
    loadComponent: () => import('./pages/reservar-cita/reservar-cita.component').then(m => m.ReservarCitaComponent)
  }
];