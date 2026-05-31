import { Injectable, signal, computed } from '@angular/core';
import { Cita, MedicoUI, FichaClinicaUI } from '../models/cita.model';
import { PerfilPaciente } from '../models/paciente.model';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  // Estado reactivo inmutable de las citas del paciente logueado
  private _citas = signal<Cita[]>([
    { id: 101, pacienteId: 1, medicoId: 302, medicoNombre: 'Dr. Carlos Mendoza Arana', especialidadNombre: 'Cardiología', fecha: '2026-06-05', hora: '10:00', estado: 'CONFIRMADA', motivoConsulta: 'Chequeo rutinario de presión' }
  ]);
  public citas = this._citas.asReadonly();

  // Catálogo maestro de Médicos
  private _medicos = signal<MedicoUI[]>([
    { id: 301, nombre: 'Dra. Sofía Castro Ortiz', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200', disponibilidad: ['08:00', '09:00', '11:30'], calificacion: 5 },
    { id: 302, nombre: 'Dr. Carlos Mendoza Arana', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', disponibilidad: ['10:00', '14:30', '16:00'], calificacion: 4 },
    { id: 303, nombre: 'Dra. Ana Rivas Beltrán', especialidadId: 2, avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200', disponibilidad: ['08:30', '10:30'], calificacion: 5 }
  ]);
  public medicos = this._medicos.asReadonly();

  // Estado Reactivo de las Fichas Clínicas (Historial)
  private _fichasClinicas = signal<FichaClinicaUI[]>([
    {
      citaId: 101,
      diagnostico: 'Evolución clínica favorable. Frecuencia cardiaca en rangos normales (72 lpm). Presión arterial controlada.',
      tratamiento: 'Losartán 50mg — 1 tableta cada 24 horas por las mañanas. Mantener dieta baja en sodio.',
      observaciones: 'Paciente refiere adherencia al tratamiento. Próximo control requerido en 3 meses.'
    }
  ]);
  public fichasClinicas = this._fichasClinicas.asReadonly();

  // Estado reactivo del perfil del paciente logueado
  private _perfil = signal<PerfilPaciente>({
    nombreCompleto: 'Ricardo Miguel Flores Toribio',
    dni: '74839201',
    correo: 'ricardo.flores@hospital.com',
    telefono: '987654321',
    direccion: 'Av. Las Palmeras 456, Lima',
    contactoEmergenciaNombre: 'María Toribio',
    contactoEmergenciaTelefono: '912345678',
    tipoSangre: 'O+'
  });
  public perfil = this._perfil.asReadonly();

  /**
   * Transacciona de forma inmutable una nueva cita en el listado del paciente
   */
  agregarCita(nuevaCita: Cita): void {
    this._citas.update(actuales => [...actuales, nuevaCita]);
  }

  actualizarPerfil(datosActualizados: PerfilPaciente): void {
    this._perfil.set({ ...datosActualizados });
  }
}
