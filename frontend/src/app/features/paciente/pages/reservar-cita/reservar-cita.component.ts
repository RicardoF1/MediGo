import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { MedicoUI } from '../../models/cita.model';

@Component({
    selector: 'app-reservar-cita',
    imports: [CommonModule, FormsModule],
    templateUrl: './reservar-cita.component.html',
    styleUrls: ['./reservar-cita.component.scss']
})
export class ReservarCitaComponent {
  // Inyección de servicios del núcleo e infraestructura
  private pacienteService = inject(PacienteService);
  private router = inject(Router);

  // Control de navegación del asistente visual
  public pasoActual = signal<number>(1);

  // SIGNAL FORMS: Propiedades reactivas nativas independientes
  public especialidadSeleccionada = signal<string>('');
  public medicoSeleccionadoId = signal<number | null>(null);
  public fechaSeleccionada = signal<string>('');
  public horaSeleccionada = signal<string>('');
  public motivoConsulta = signal<string>('');

  // VALIDACIONES EN TIEMPO REAL (Signal Forms Pattern)
  public esPaso1Valido = computed(() => this.especialidadSeleccionada() !== '');
  public esPaso2Valido = computed(() => this.medicoSeleccionadoId() !== null);
  public esPaso3Valido = computed(() => 
    this.fechaSeleccionada() !== '' && 
    this.horaSeleccionada() !== '' && 
    this.motivoConsulta().trim().length >= 10
  );

  // FILTRADOS REACTIVOS COMPUTADOS
  public medicosFiltrados = computed(() => {
    const espId = Number(this.especialidadSeleccionada());
    return this.pacienteService.medicos().filter(m => m.especialidadId === espId);
  });

  public infoMedicoSeleccionado = computed(() => {
    return this.pacienteService.medicos().find(m => m.id === this.medicoSeleccionadoId()) || null;
  });

  siguientePaso(): void {
    if (this.pasoActual() === 1 && this.esPaso1Valido()) this.pasoActual.set(2);
    else if (this.pasoActual() === 2 && this.esPaso2Valido()) this.pasoActual.set(3);
  }

  anteriorPaso(): void {
    if (this.pasoActual() > 1) this.pasoActual.update(p => p - 1);
  }

  finalizarReserva(): void {
    const medico = this.infoMedicoSeleccionado();
    if (!medico || !this.esPaso3Valido()) return;

    this.pacienteService.agregarCita({
      id: Math.floor(Math.random() * 1000),
      pacienteId: 1,
      medicoId: medico.id,
      medicoNombre: medico.nombre,
      especialidadNombre: this.especialidadSeleccionada() === '1' ? 'Cardiología' : 'Pediatría',
      fecha: this.fechaSeleccionada(),
      hora: this.horaSeleccionada(),
      estado: 'CONFIRMADA',
      motivoConsulta: this.motivoConsulta()
    });

    alert('Cita agendada correctamente.');
    this.router.navigate(['/paciente']);
  }
}
