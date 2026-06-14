import { Component, inject, OnInit, signal } from '@angular/core';
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
export class DashboardPacienteComponent implements OnInit {
  // Inyección del servicio de dominio compartido
  private pacienteService = inject(PacienteService);

  // Exposición de la señal de citas en modo solo lectura para la vista
  public citasPaciente = this.pacienteService.citas;

  // SIGNALS PARA MÉTRICAS: Se actualizarán con la respuesta del API
  public totalCitasPendientes = signal(0);
  public totalCitasAtendidas = signal(0);

  ngOnInit(): void {
    // 1. Cargar el resumen del dashboard desde la API
    this.pacienteService.obtenerResumenDashboard().subscribe({
      next: (resumen) => {
        this.totalCitasPendientes.set(resumen.citasActivas);
        this.totalCitasAtendidas.set(resumen.atencionesConcluidas);
      },
      error: (err) => console.error('Error al cargar resumen del dashboard:', err)
    });

    // 2. Cargar el listado completo de citas para la tabla
    this.pacienteService.cargarHistorialReal();
  }

  // Buscador rápido del catálogo de médicos para los avatares
  obtenerAvatarMedico(medicoId: number): string {
    const medico = this.pacienteService.medicos().find(m => m.idMedico === medicoId);
    return medico 
      ? medico.avatar 
      : 'https://api.dicebear.com/9.x/lorelei/svg?seed=Jack';
  }
}