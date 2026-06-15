import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
    selector: 'app-reservar-cita',
    imports: [CommonModule, FormsModule],
    templateUrl: './reservar-cita.component.html',
    styleUrls: ['./reservar-cita.component.scss']
})
export class ReservarCitaComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);

  public pasoActual = signal<number>(1);
  public listaEspecialidades = signal<{ idEspecialidad: number; nombreEspecialidad: string }[]>([]);

  // Estado de carga para el botón de confirmación
  public isSubmitting = signal<boolean>(false);

  // SIGNALS DEL FORMULARIO
  public 'especialidadSeleccionadaId' = signal<number | null>(null);
  public 'medicoSeleccionadoId' = signal<number | null>(null);
  public 'fechaSeleccionada' = signal<string>('');
  public 'horaSeleccionada' = signal<string>('');
  public 'motivoConsulta' = signal<string>('');

  // VALIDACIONES
  public esPaso1Valido = computed(() => this.especialidadSeleccionadaId() !== null);
  public esPaso2Valido = computed(() => this.medicoSeleccionadoId() !== null);
  public esPaso3Valido = computed(() => 
    this.fechaSeleccionada() !== '' && 
    this.horaSeleccionada() !== '' && 
    this.motivoConsulta().trim().length >= 10
  );

  public medicosFiltrados = computed(() => this.pacienteService.medicos());

  public infoMedicoSeleccionado = computed(() => {
    return this.pacienteService.medicos().find(m => m.idMedico === this.medicoSeleccionadoId()) || null;
  });

  ngOnInit(): void {
    this.pacienteService.obtenerEspecialidades().subscribe({
      next: (data) => this.listaEspecialidades.set(data),
      error: (err) => console.error('Error al inicializar formulario de reserva:', err)
    });
  }

  seleccionarEspecialidad(id: number): void {
    this.especialidadSeleccionadaId.set(id);
    this.medicoSeleccionadoId.set(null);
    this.horaSeleccionada.set('');
    this.pacienteService.cargarMedicosPorEspecialidad(id);
  }

  siguientePaso(): void {
    if (this.pasoActual() === 1 && this.esPaso1Valido()) this.pasoActual.set(2);
    else if (this.pasoActual() === 2 && this.esPaso2Valido()) this.pasoActual.set(3);
  }

  anteriorPaso(): void {
    if (this.pasoActual() > 1) this.pasoActual.update(p => p - 1);
  }

  finalizarReserva(): void {
    const espId = this.especialidadSeleccionadaId();
    const medId = this.medicoSeleccionadoId();
    
    if (!espId || !medId || !this.esPaso3Valido() || this.isSubmitting()) return;

    // Activamos el estado de carga (Feedback visual de "guardando...")
    this.isSubmitting.set(true);

    const payloadCita = {
      especialidadId: espId,
      medicoId: medId,
      fecha: this.fechaSeleccionada(),
      hora: this.horaSeleccionada(),
      motivoConsulta: this.motivoConsulta()
    };

    this.pacienteService.registrarCitaReal(payloadCita).subscribe({
      next: (respuesta) => {
        // En lugar de alert(), dejamos que la UX fluya directo al redireccionar
        const medico = this.infoMedicoSeleccionado();
        const objetoEspecialidad = this.listaEspecialidades().find(e => e.idEspecialidad === espId);
        
        this.pacienteService.agregarCita({
          id: respuesta.idCita,
          pacienteId: 0, 
          medicoId: medId,
          medicoNombre: medico ? medico.nombre : 'Especialista',
          especialidadNombre: objetoEspecialidad ? objetoEspecialidad.nombreEspecialidad : 'General',
          fecha: this.fechaSeleccionada(),
          hora: this.horaSeleccionada(),
          estado: 'PENDIENTE',
          motivoConsulta: this.motivoConsulta()
        });

        this.router.navigate(['/paciente']);
      },
      error: (err) => {
        this.isSubmitting.set(false); // Apagamos el loading para permitir reintentar
        console.error('Fallo crítico en el proceso de reserva:', err);
        
      }
    });
  }
}