import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '', 
    loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
  },
  {
    path: 'usuarios', 
    loadComponent: () => import('./pages/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent)
  }
];