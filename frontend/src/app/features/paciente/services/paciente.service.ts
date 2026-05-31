import { Injectable, signal, computed } from '@angular/core';
import { Cita, MedicoUI } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Estado reactivo inmutable de las citas del paciente logueado
  private _citas = signal<Cita[]>([
    { id: 101, pacienteId: 1, medicoId: 302, medicoNombre: 'Dr. Carlos Mendoza Arana', especialidadNombre: 'Cardiología', fecha: '2026-06-05', hora: '10:00', estado: 'CONFIRMADA', motivoConsulta: 'Chequeo rutinario de presión' }
  ]);
  public citas = this._citas.asReadonly();

  // Catálogo maestro de Médicos con atributos estéticos premium reales
  private _medicos = signal<MedicoUI[]>([
    { id: 301, nombre: 'Dra. Sofía Castro Ortiz', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200', disponibilidad: ['08:00', '09:00', '11:30'], calificacion: 5 },
    { id: 302, nombre: 'Dr. Carlos Mendoza Arana', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', disponibilidad: ['10:00', '14:30', '16:00'], calificacion: 4 },
    { id: 303, nombre: 'Dra. Ana Rivas Beltrán', especialidadId: 2, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', disponibilidad: ['08:30', '10:30'], calificacion: 5 }
  ]);
  public medicos = this._medicos.asReadonly();

  /**
   * Transacciona de forma inmutable una nueva cita en el listado del paciente
   */
  agregarCita(nuevaCita: Cita): void {
    this._citas.update(actuales => [...actuales, nuevaCita]);
  }
}

/* import { Injectable, signal, computed } from '@angular/core';
import { Medico, Especialidad } from '../models/medico.model';
import { Cita } from '../models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Datos maestros simulados (Mocks)
  private _especialidades = signal<Especialidad[]>([
    { id: 1, nombre: 'Cardiología' },
    { id: 2, nombre: 'Pediatría' },
    { id: 3, nombre: 'Medicina General' }
  ]);

  private _medicos = signal<Medico[]>([
    { id: 101, nombre: 'Dr. Carlos Mendoza', especialidadId: 1, horariosDisponibles: ['08:00', '09:30', '11:00'] },
    { id: 102, nombre: 'Dra. Ana Rivas', especialidadId: 1, horariosDisponibles: ['14:00', '15:30', '17:00'] },
    { id: 201, nombre: 'Dr. Luis Peralta', especialidadId: 2, horariosDisponibles: ['09:00', '10:00', '11:30'] },
    { id: 301, nombre: 'Dra. Sofía Castro', especialidadId: 3, horariosDisponibles: ['08:30', '13:00', '16:30'] }
  ]);

  // Historial de citas del paciente controlado por una Signal reactiva
  private _citas = signal<Cita[]>([]);

  // Exposición de Signals de solo lectura
  public especialidades = this._especialidades.asReadonly();
  public medicos = this._medicos.asReadonly();
  public citas = this._citas.asReadonly();

  /**
   * Registra una nueva cita médica en el estado local de la aplicación
   */
  /*agregarCita(nuevaCita: OofCitaData): void {
    const citaCompleta: Cita = {
      id: Math.floor(Math.random() * 1000),
      pacienteId: 1, // Id simulado del paciente en sesión
      ...nuevaCita,
      estado: 'CONFIRMADA'
    };

    // Actualizamos la Signal agregando el nuevo elemento de forma inmutable
    this._citas.update(citasActuales => [...citasActuales, citaCompleta]);
  }
}*/

// Tipo auxiliar para la inserción limpia de datos de la cita
/*interface OofCitaData {
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fecha: string;
  hora: string;
} */