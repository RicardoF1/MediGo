import { Injectable, signal, computed } from '@angular/core';
import { CitaMedico } from '../models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // Estado local simulado para la agenda del médico logueado
  private _citasAgenda = signal<CitaMedico[]>([
    { id: 501, pacienteNombre: 'Ricardo Almonacid', pacienteEdad: 24, hora: '08:00', estado: 'PENDIENTE', motivoConsulta: 'Chequeo general preventivo' },
    { id: 502, pacienteNombre: 'María Elena Flores', pacienteEdad: 45, hora: '09:30', estado: 'PENDIENTE', motivoConsulta: 'Control de hipertensión arterial' },
    { id: 503, pacienteNombre: 'Juan Carlos Soto', pacienteEdad: 32, hora: '11:00', estado: 'ATENDIDA', motivoConsulta: 'Evaluación física anual' }
  ]);

  // Exposición de solo lectura de la Signal
  public citasAgenda = this._citasAgenda.asReadonly();

  // Signals computadas para estadísticas rápidas en la cabecera médica
  public totalPendientes = computed(() => this._citasAgenda().filter(c => c.estado === 'PENDIENTE').length);
  public totalAtendidos = computed(() => this._citasAgenda().filter(c => c.estado === 'ATENDIDA').length);

  /**
   * Actualiza el estado de una cita médica a ATENDIDA tras registrar el diagnóstico
   */
  registrarAtencion(citaId: number): void {
    this._citasAgenda.update(citas => 
      citas.map(c => c.id === citaId ? { ...c, estado: 'ATENDIDA' } : c)
    );
  }
}