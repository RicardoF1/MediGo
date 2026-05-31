import { Injectable, signal } from '@angular/core';
import { CitaMedico, PerfilMedico } from '../models/agenda.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  // Estado reactivo de las citas asignadas al médico logueado
  private _citasAgenda = signal<CitaMedico[]>([
    {
      id: 101,
      pacienteId: 1,
      pacienteNombre: 'Ricardo Miguel Flores Toribio',
      pacienteDni: '74839201',
      fecha: '2026-06-05',
      hora: '10:00',
      estado: 'CONFIRMADA',
      motivoConsulta: 'Chequeo rutinario de presión y control cardiovascular.'
    },
    {
      id: 102,
      pacienteId: 2,
      pacienteNombre: 'Camila San Martín Vega',
      pacienteDni: '45892013',
      fecha: '2026-06-05',
      hora: '11:30',
      estado: 'PENDIENTE',
      motivoConsulta: 'Evaluación por arritmias esporádicas.'
    }
  ]);
  public citasAgenda = this._citasAgenda.asReadonly();

  /**
   * Actualiza transaccionalmente el estado clínico de una cita en la agenda
   */
  cambiarEstadoCita(citaId: number, nuevoEstado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA'): void {
    this._citasAgenda.update(citas => 
      citas.map(c => c.id === citaId ? { ...c, estado: nuevoEstado } : c)
    );
  }

  // Estado reactivo del perfil del médico logueado
  private _perfil = signal<PerfilMedico>({
    nombreCompleto: 'Dr. Carlos Mendoza Arana',
    colegiatura: 'CMP-75943',
    especialidad: 'Cardiología',
    correo: 'carlos.mendoza@hospital.com',
    telefono: '955412367',
    consultorio: 'Bloque B - Piso 3 (Consultorio 302)',
    activoParaCitas: true
  });
  public perfil = this._perfil.asReadonly();
  
  /**
   * Actualiza los datos del perfil del médico de forma inmutable
   */
  actualizarPerfil(datosActualizados: PerfilMedico): void {
    this._perfil.set({ ...datosActualizados });
  }

}