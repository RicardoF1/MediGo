import { Injectable, signal, computed } from '@angular/core';
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
  agregarCita(nuevaCita: OofCitaData): void {
    const citaCompleta: Cita = {
      id: Math.floor(Math.random() * 1000),
      pacienteId: 1, // Id simulado del paciente en sesión
      ...nuevaCita,
      estado: 'CONFIRMADA'
    };

    // Actualizamos la Signal agregando el nuevo elemento de forma inmutable
    this._citas.update(citasActuales => [...citasActuales, citaCompleta]);
  }
}

// Tipo auxiliar para la inserción limpia de datos de la cita
interface OofCitaData {
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fecha: string;
  hora: string;
}