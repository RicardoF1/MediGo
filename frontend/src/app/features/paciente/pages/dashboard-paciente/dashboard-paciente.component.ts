import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="row mb-4">
        <div class="col-12">
          <div class="p-4 bg-white rounded-3 shadow-sm border-0">
            <h2 class="text-secondary fw-bold mb-1">Panel de Control del Paciente</h2>
            <p class="text-muted mb-0">Gestione sus requerimientos médicos de manera ágil y centralizada.</p>
          </div>
        </div>
      </div>

      <div class="row g-4 mb-5">
        
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm transition-card">
            <div class="card-body p-4 d-flex flex-column">
              <div class="mb-3">
                <span class="p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-inline-block fs-4 fw-bold">📅</span>
              </div>
              <h5 class="card-title fw-bold text-dark">Nueva Cita Médica</h5>
              <p class="card-text text-muted flex-grow-1">Reserve un turno con nuestros especialistas médicos en menos de tres pasos lógicos.</p>
              <button class="btn btn-primary w-100 mt-3 fw-semibold">Reservar Turno</button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm transition-card">
            <div class="card-body p-4 d-flex flex-column">
              <div class="mb-3">
                <span class="p-3 bg-success bg-opacity-10 text-success rounded-3 d-inline-block fs-4 fw-bold">📋</span>
              </div>
              <h5 class="card-title fw-bold text-dark">Mis Citas Programadas</h5>
              <p class="card-text text-muted flex-grow-1">Visualice el estado de sus citas vigentes, horarios asignados o cancele de ser necesario.</p>
              <button class="btn btn-outline-success w-100 mt-3 fw-semibold">Ver Historial</button>
            </div>
          </div>
        </div>

        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm transition-card">
            <div class="card-body p-4 d-flex flex-column">
              <div class="mb-3">
                <span class="p-3 bg-info bg-opacity-10 text-info rounded-3 d-inline-block fs-4 fw-bold">👤</span>
              </div>
              <h5 class="card-title fw-bold text-dark">Mi Perfil Clínico</h5>
              <p class="card-text text-muted flex-grow-1">Consulte sus datos personales de registro, antecedentes médicos cargados e información de contacto.</p>
              <button class="btn btn-outline-info w-100 mt-3 fw-semibold text-dark">Gestionar Datos</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .transition-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .transition-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 .5rem 1.5rem rgba(0,0,0,.1) !important;
    }
  `]
})
export class DashboardPacienteComponent {
  public authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
/* import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-paciente.component.html',
  styles: ``
})
export class DashboardPacienteComponent {

}
 */