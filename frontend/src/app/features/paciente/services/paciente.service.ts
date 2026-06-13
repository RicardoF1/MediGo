import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cita, MedicoUI, FichaClinicaUI } from '../models/cita.model';
import { PerfilPaciente } from '../models/paciente.model';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/paciente`;
  private apiCitasUrl = `${environment.apiUrl}/api/citas`; // URL de la API de Citas

  // === ESTADOS REACTIVOS REALES ===
  private _citas = signal<Cita[]>([]);
  public citas = this._citas.asReadonly();

  private _medicos = signal<MedicoUI[]>([]);
  public medicos = this._medicos.asReadonly();

  private _fichasClinicas = signal<FichaClinicaUI[]>([]);
  public fichasClinicas = this._fichasClinicas.asReadonly();

  private _perfil = signal<PerfilPaciente | null>(null);
  public perfil = this._perfil.asReadonly();

  // === AGENDAMIENTO REAL CON FASTAPI ===

  /** Obtiene la lista de especialidades disponibles en Supabase */
  obtenerEspecialidades(): Observable<{ idEspecialidad: number; nombreEspecialidad: string }[]> {
    return this.http.get<{ idEspecialidad: number; nombreEspecialidad: string }[]>(`${this.apiCitasUrl}/especialidades`);
  }

  /** Descarga y actualiza el signal de médicos filtrado por especialidad */
  cargarMedicosPorEspecialidad(especialidadId: number): void {
    this.http.get<MedicoUI[]>(`${this.apiCitasUrl}/medicos/${especialidadId}`).subscribe({
      next: (medicosData) => this._medicos.set(medicosData),
      error: (err) => console.error('Error al recuperar staff médico de Supabase:', err)
    });
  }

  /** Envía la reserva de la cita al servidor */
  registrarCitaReal(payload: { especialidadId: number; medicoId: number; fecha: string; hora: string; motivoConsulta: string }): Observable<{ status: string; message: string; idCita: number }> {
    return this.http.post<{ status: string; message: string; idCita: number }>(`${this.apiCitasUrl}/reservar`, payload);
  }

  // === MÉTODOS EXISTENTES DE PERFIL Y AGENDA ===

  agregarCita(nuevaCita: Cita): void {
    this._citas.update(actuales => [...actuales, nuevaCita]);
  }

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


  cargarHistorialReal(): void {
    this.http.get<Cita[]>(`${this.apiCitasUrl}/historial`).subscribe({
      next: (data) => {
        console.log('Datos recibidos del API:', data); // <-- ABRE LA CONSOLA DEL NAVEGADOR
        this._citas.set(data);
      },
      error: (err) => console.error('Error:', err)
    });
  }
}

