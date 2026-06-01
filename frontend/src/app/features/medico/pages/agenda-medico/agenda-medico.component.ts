import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-agenda-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.scss']
})
export class AgendaMedicoComponent {
  private medicoService = inject(MedicoService);

  // Lectura del estado global desde el servicio
  public todasLasCitas = this.medicoService.citasAgenda;

  // SIGNAL MUTABLE: Controla el filtro de estado seleccionado en la UI
  public filtroEstado = signal<string>('TODAS');

  // COMPUTED: Filtrado reactivo en tiempo real basado en el estado de la señal mutable
  public citasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODAS') {
      return this.todasLasCitas();
    }
    return this.todasLasCitas().filter(c => c.estado === filtro);
  });

  // Métodos de acción para la gestión de la agenda
  public actualizarEstado(citaId: number, estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA'): void {
    this.medicoService.cambiarEstadoCita(citaId, estado);
  }
}
