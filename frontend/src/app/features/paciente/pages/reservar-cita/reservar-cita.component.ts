import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';
import { Medico } from '../../models/medico.model';


@Component({
  selector: 'app-reservar-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservar-cita.component.html',
  styleUrls: ['./reservar-cita.component.scss']
})
export class ReservarCitaComponent {
  private router = inject(Router);
  public pacienteService = inject(PacienteService);

  // Estados reactivos locales del formulario por pasos
  public pasoActual = signal<number>(1);
  public idEspecialidadSeleccionada = signal<number | null>(null);
  public medicoSeleccionado = signal<Medico | null>(null);
  public fechaSeleccionada = signal<string>('');
  public horaSeleccionada = signal<string>('');

  // Signal Computada: Filtra especialistas según la especialidad elegida
  public medicosFiltrados = computed(() => {
    const espId = this.idEspecialidadSeleccionada();
    return espId ? this.pacienteService.medicos().filter(m => m.especialidadId === espId) : [];
  });

  // Signal Computada: Obtiene el nombre de la especialidad para el resumen final
  public nombreEspecialidadSeleccionada = computed(() => {
    const id = this.idEspecialidadSeleccionada();
    return this.pacienteService.especialidades().find(e => e.id === id)?.nombre || '';
  });

  cambiarPaso(direccion: number): void {
    this.pasoActual.update(p => p + direccion);
  }

  seleccionarEspecialidad(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.idEspecialidadSeleccionada.set(val ? Number(val) : null);
    this.medicoSeleccionado.set(null);
    this.horaSeleccionada.set('');
  }

  seleccionarMedico(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    const med = this.pacienteService.medicos().find(m => m.id === Number(val)) || null;
    this.medicoSeleccionado.set(med);
    this.horaSeleccionada.set('');
  }

  seleccionarFecha(event: Event): void {
    this.fechaSeleccionada.set((event.target as HTMLInputElement).value);
  }

  confirmarCita(): void {
    const medico = this.medicoSeleccionado();
    if (!medico || !this.fechaSeleccionada() || !this.horaSeleccionada()) return;

    // Persistimos en el servicio central de pacientes
    this.pacienteService.agregarCita({
      medicoId: medico.id,
      medicoNombre: medico.nombre,
      especialidadNombre: this.nombreEspecialidadSeleccionada(),
      fecha: this.fechaSeleccionada(),
      hora: this.horaSeleccionada()
    });

    alert('🎉 Cita reservada de manera exitosa y almacenada en el estado del servicio.');
    this.router.navigate(['/paciente']);
  }
}