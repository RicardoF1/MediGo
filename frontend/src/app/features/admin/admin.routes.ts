import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard-admin',
        loadComponent: () => 
          import('./pages/dashboard-admin/dashboard-admin.component').then(m => m.DashboardAdminComponent)
      },
      {
        path: 'gestion-usuarios',
        loadComponent: () => 
          import('./pages/gestion-usuarios/gestion-usuarios.component').then(m => m.GestionUsuariosComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard-admin',
        pathMatch: 'full'
      }
    ]
  }
];