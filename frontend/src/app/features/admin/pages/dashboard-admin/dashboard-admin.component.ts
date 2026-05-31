import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { PacienteService } from '../../../paciente/services/paciente.service';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent {
  private adminService = inject(AdminService);
  private pacienteService = inject(PacienteService);

  // Exposición directa de KPIs institucionales reactivos (Read-only)
  public medicosCount = this.adminService.totalMedicosActivos;
  public totalCitas = this.adminService.totalCitasGlobales;
  public activasCount = this.adminService.totalCitasConfirmadas;
  public atendidasCount = this.adminService.totalCitasAtendidas;
  public ocupacionPct = this.adminService.tasaOcupacionClinica;

  // Acceso al listado maestro de médicos para el reporte visual de auditoría
  public listaMedicos = this.pacienteService.medicos;
}