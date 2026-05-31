import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold" [routerLink]="['/']">MediCore</a>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#medicoreNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="medicoreNavbar">
          <ul class="navbar-collapse navbar-nav me-auto mb-2 mb-lg-0">
            @if (authService.userRole() === 'PACIENTE') {
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/paciente']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Inicio</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/paciente/citas']" routerLinkActive="active">Mis Citas</a>
              </li>
            }
            @if (authService.userRole() === 'MEDICO') {
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" [routerLink]="['/medico']" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Mi Agenda</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" [routerLink]="['/medico/perfil']" routerLinkActive="active">Mi Perfil Profesional</a>
                </li>
              </ul>
            }
            @if (authService.userRole() === 'ADMIN') {
              <li class="nav-item">
                <a class="nav-link" [routerLink]="['/admin']" routerLinkActive="active">Dashboard General</a>
              </li>
            }
          </ul>

          <div class="d-flex align-items-center">
            @if (authService.isAuthenticated()) {
              <span class="navbar-text text-white me-3 d-none d-sm-inline">
                Hola, <strong>{{ authService.currentUser()?.nombre }}</strong> 
                <span class="badge bg-light text-primary ms-1 fs-xs">{{ authService.userRole() }}</span>
              </span>
              <button (click)="onLogout()" class="btn btn-sm btn-outline-light fw-semibold">
                Cerrar Sesión
              </button>
            } @else {
              <button [routerLink]="['/login']" class="btn btn-sm btn-light fw-semibold">
                Iniciar Sesión
              </button>
            }
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
/* import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styles: ``
})
export class NavbarComponent {

} */
