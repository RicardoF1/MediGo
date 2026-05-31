import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicoService } from '../../services/medico.service';
import { CitaMedico } from '../../models/agenda.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-agenda-medico',
    imports: [CommonModule, FormsModule],
    templateUrl: './agenda-medico.component.html',
    styleUrls: ['./agenda-medico.component.scss']
})
export class AgendaMedicoComponent {
  public medicoService = inject(MedicoService);

  // Estados locales reactivos para el panel de diagnóstico e historial clínico
  public citaSeleccionada = signal<CitaMedico | null>(null);
  public diagnosticoInput = signal<string>('');
  public tratamientoInput = signal<string>('');

  abrirFichaConsulta(cita: CitaMedico): void {
    this.citaSeleccionada.set(cita);
    this.diagnosticoInput.set('');
    this.tratamientoInput.set('');
  }

  guardarConsulta(): void {
    const cita = this.citaSeleccionada();
    if (!cita || !this.diagnosticoInput().trim()) return;

    // Actualizamos el estado inmutable en el servicio mediante las Signals
    this.medicoService.registrarAtencion(cita.id);
    
    alert(`📋 Ficha de atención clínica registrada con éxito para el paciente: ${cita.pacienteNombre}`);
    this.citaSeleccionada.set(null); // Cerramos el panel lateral
  }
}