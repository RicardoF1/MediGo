import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';

@Component({
  selector: 'app-historial-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-citas.component.html',
  styleUrls: ['./historial-citas.component.scss']
})
export class HistorialCitasComponent {
  private pacienteService = inject(PacienteService);

  // Consumo de Signals de solo lectura desde el servicio centralizado
  public todasLasCitas = this.pacienteService.citas;
  private fichas = this.pacienteService.fichasClinicas;

  // SIGNAL MUTABLE: Estado local de control del flujo
  public citaSeleccionadaId = signal<number | null>(null);

  // COMPUTED: Filtra reactivamente el historial de consultas
  public historialAtendidas = computed(() => {
    return this.todasLasCitas().filter(c => c.estado === 'ATENDIDA' || c.estado === 'CONFIRMADA');
  });

  // COMPUTED: Cruza la cita seleccionada con su correspondiente expediente clínico
  public detalleFichaActiva = computed(() => {
    const id = this.citaSeleccionadaId();
    if (!id) return null;
    
    const cita = this.todasLasCitas().find(c => c.id === id);
    const ficha = this.fichas().find(f => f.citaId === id);

    if (!cita) return null;

    return {
      medico: cita.medicoNombre,
      especialidad: cita.especialidadNombre,
      fecha: cita.fecha,
      diagnostica: ficha?.diagnostico || 'El especialista no ha registrado el diagnóstico formal todavía.',
      tratamiento: ficha?.tratamiento || 'Sin prescripción médica asignada para este turno.',
      observaciones: ficha?.observaciones || 'Sin observaciones adicionales.'
    };
  });

  public inspeccionarCita(id: number): void {
    this.citaSeleccionadaId.set(id);
  }

  public cerrarDetalle(): void {
    this.citaSeleccionadaId.set(null);
  }
}