import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita, MedicoUI, FichaClinicaUI } from '../models/cita.model';
import { PerfilPaciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/paciente`;

  // Mocks temporales para las otras secciones de la agenda
  private _citas = signal<Cita[]>([
    { id: 101, pacienteId: 1, medicoId: 302, medicoNombre: 'Dr. Carlos Mendoza Arana', especialidadNombre: 'Cardiología', fecha: '2026-06-05', hora: '10:00', estado: 'CONFIRMADA', motivoConsulta: 'Chequeo rutinario de presión' }
  ]);
  public citas = this._citas.asReadonly();

  private _medicos = signal<MedicoUI[]>([
    { id: 301, nombre: 'Dra. Sofía Castro Ortiz', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200', disponibilidad: ['08:00', '09:00', '11:30'], calificacion: 5 },
    { id: 302, nombre: 'Dr. Carlos Mendoza Arana', especialidadId: 1, avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', disponibilidad: ['10:00', '14:30', '16:00'], calificacion: 4 }
  ]);
  public medicos = this._medicos.asReadonly();

  private _fichasClinicas = signal<FichaClinicaUI[]>([
    { citaId: 101, diagnostico: 'Evolución favorable.', tratamiento: 'Losartán 50mg.', observaciones: 'Control en 3 meses.' }
  ]);
  public fichasClinicas = this._fichasClinicas.asReadonly();

  // === ESTADO REACTIVO DEL PERFIL DINÁMICO ===
  private _perfil = signal<PerfilPaciente | null>(null);
  public perfil = this._perfil.asReadonly();

  agregarCita(nuevaCita: Cita): void {
    this._citas.update(actuales => [...actuales, nuevaCita]);
  }

  // === PETICIONES HTTP DE PERSISTENCIA REAL ===

  cargarPerfil(): void {
    this.http.get<PerfilPaciente>(`${this.apiUrl}/perfil`).subscribe({
      next: (perfilData) => this._perfil.set(perfilData),
      error: (err) => console.error('Error al descargar el perfil del paciente desde Supabase:', err)
    });
  }

  actualizarPerfil(datosActualizados: PerfilPaciente): void {
    this.http.put<{ status: string; message: string }>(`${this.apiUrl}/perfil`, datosActualizados)
      .subscribe({
        next: () => {
          this._perfil.set({ ...datosActualizados });
          alert('💾 Cambios de filiación guardados de manera permanente en Supabase.');
        },
        error: (err) => console.error('Error al actualizar filiación clínica:', err)
      });
  }
}