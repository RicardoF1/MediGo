import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PacienteService } from '../../services/paciente.service';
import { Cita } from '../../models/cita.model';

@Component({
    selector: 'app-historial-citas',
    imports: [CommonModule],
    templateUrl: './historial-citas.component.html',
    styleUrls: ['./historial-citas.component.scss']
})
export class HistorialCitasComponent {
  public pacienteService = inject(PacienteService);

  // Estado reactivo para filtrar las citas por estado en la UI
  public filtroEstado = signal<string>('TODAS');
  public citaSeleccionada = signal<Cita | null>(null);

  // Signal Computada: Combina las citas preestablecidas con las del servicio y aplica el filtro
  public citasFiltradas = computed(() => {
    // Citas históricas quemadas (Mocks de atenciones pasadas)
    const citasHistoricas: Cita[] = [
      { id: 901, pacienteId: 1, medicoId: 301, medicoNombre: 'Dra. Sofía Castro', especialidadNombre: 'Medicina General', fecha: '2026-04-10', hora: '10:00', estado: 'ATENDIDA' },
      { id: 902, pacienteId: 1, medicoId: 101, medicoNombre: 'Dr. Carlos Mendoza', especialidadNombre: 'Cardiología', fecha: '2026-03-15', hora: '16:00', estado: 'CANCELADA' }
    ];

    const todas = [...this.pacienteService.citas(), ...citasHistoricas];
    const filtro = this.filtroEstado();

    return filtro === 'TODAS' ? todas : todas.filter(c => c.estado === filtro);
  });

  verDetallesReceta(cita: Cita): void {
    this.citaSeleccionada.set(cita);
  }
}