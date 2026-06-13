import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.scss']
})
export class HistorialCitasComponent implements OnInit {
  private pacienteService = inject(PacienteService);

  // Consumo de Signals
  public todasLasCitas = this.pacienteService.citas;

  // Signal Local para control de vista
  public citaSeleccionadaId = signal<number | null>(null);

  ngOnInit() {
    // Carga los datos reales al iniciar
    this.pacienteService.cargarHistorialReal();
  }

  // Filtra solo citas terminadas (ajusta el estado según tu BD)
  public historialAtendidas = computed(() => {
    const todas = this.todasLasCitas();
    // Incluimos todos los estados que mencionaste
    return todas.filter(c => 
      c.estado === 'PENDIENTE' || 
      c.estado === 'COMPLETADA' || 
      c.estado === 'CANCELADA'
    );
  });

  // Busca la cita seleccionada para mostrar el detalle
  public detalleCitaActiva = computed(() => {
    const id = this.citaSeleccionadaId();
    if (!id) return null;
    return this.todasLasCitas().find(c => c.id === id) || null;
  });

  public inspeccionarCita(id: number): void {
    this.citaSeleccionadaId.set(id);
  }

  public cerrarDetalle(): void {
    this.citaSeleccionadaId.set(null);
  }
}