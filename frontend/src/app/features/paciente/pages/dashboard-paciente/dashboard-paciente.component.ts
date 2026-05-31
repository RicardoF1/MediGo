import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-dashboard-paciente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-paciente.component.html',
  styleUrls: ['./dashboard-paciente.component.scss']
})
export class DashboardPacienteComponent {
  // Inyección del servicio de dominio compartido
  private pacienteService = inject(PacienteService);

  // Exposición de la señal de citas en modo solo lectura para la vista
  public citasPaciente = this.pacienteService.citas;

  // SIGNALS COMPUTADAS: Métricas de control analítico en tiempo real
  public totalCitasPendientes = computed(() => {
    return this.citasPaciente().filter(c => c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA').length;
  });

  public totalCitasAtendidas = computed(() => {
    return this.citasPaciente().filter(c => c.estado === 'ATENDIDA').length;
  });

  // Buscador rápido del catálogo de médicos desde el servicio para renderizar avatares en la lista
  obtenerAvatarMedico(medicoId: number): string {
    const medico = this.pacienteService.medicos().find(m => m.id === medicoId);
    return medico ? medico.avatar : 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150';
  }
}