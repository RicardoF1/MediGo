import { Component, computed, inject, OnInit } from '@angular/core';
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
export class DashboardAdminComponent implements OnInit {
  private adminService = inject(AdminService);
  private pacienteService = inject(PacienteService);

  // Exposición directa de KPIs institucionales reactivos basados en la API
  public medicosCount = this.adminService.totalMedicosActivos;
  public totalCitas = this.adminService.totalCitasGlobales;
  public activasCount = this.adminService.totalCitasConfirmadas;
  public atendidasCount = this.adminService.totalCitasAtendidas;
  public ocupacionPct = this.adminService.tasaOcupacionClinica;

  // Acceso al listado maestro de médicos para el reporte visual de auditoría
  public listaMedicos = this.pacienteService.medicos;

  ngOnInit(): void {
    // Al instanciarse el Dashboard, sincronizamos la lista máster de la API de FastAPI
    this.adminService.cargarUsuarios();
    
    // NOTA EXTRA OPTIONAL: Si en tu PacienteService tienes métodos para refrescar 
    // citas o médicos desde el backend, puedes invocarlos aquí también:
    // this.pacienteService.cargarCitas();
  }
  public usuariosFiltradosPorRolMedico = computed(() => {
  return this.adminService.usuariosMaster().filter(u => u.id_rol === 11);
});
}