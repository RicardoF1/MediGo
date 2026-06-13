import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico.service';

@Component({
  selector: 'app-agenda-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agenda-medico.component.html',
  styleUrls: ['./agenda-medico.component.scss']
})
export class AgendaMedicoComponent implements OnInit {
  private medicoService = inject(MedicoService);

  // Lectura directa del estado global reactivo conectado al Backend
  public todasLasCitas = this.medicoService.citasAgenda;

  // SIGNAL MUTABLE: Controla el filtro en la UI
  public filtroEstado = signal<string>('TODAS');

  // COMPUTED: Filtrado en tiempo real sin recargar datos del servidor
  public citasFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'TODAS') {
      return this.todasLasCitas();
    }
    return this.todasLasCitas().filter(c => c.estado === filtro);
  });

  ngOnInit(): void {
    // Sincronización automática de datos al levantar la vista del médico
    this.medicoService.cargarAgenda();
  }

  public actualizarEstado(citaId: number, estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA'): void {
    this.medicoService.cambiarEstadoCita(citaId, estado);
  }
}