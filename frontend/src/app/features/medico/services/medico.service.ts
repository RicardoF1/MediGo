import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CitaMedico, PerfilMedico } from '../models/agenda.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/medico`;

  private _citasAgenda = signal<CitaMedico[]>([]);
  public citasAgenda = this._citasAgenda.asReadonly();

  // El perfil inicia en null hasta que se consuma el API de Supabase
  private _perfil = signal<PerfilMedico | null>(null);
  public perfil = this._perfil.asReadonly();

  cargarAgenda(): void {
    this.http.get<CitaMedico[]>(`${this.apiUrl}/agenda`).subscribe({
      next: (citas) => this._citasAgenda.set(citas),
      error: (err) => console.error('Error al descargar la agenda médica:', err)
    });
  }

  cambiarEstadoCita(citaId: number, nuevoEstado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA'): void {
    let idEstadoMapeado = 10;

    switch (nuevoEstado) {
      case 'PENDIENTE':
        idEstadoMapeado = 10;
        break;
      case 'ATENDIDA':
        idEstadoMapeado = 11;
        break;
      case 'CANCELADA':
        idEstadoMapeado = 12;
        break;
    }

    const payload = { id_estado: idEstadoMapeado };

    this.http.patch<{ status: string, data: any }>(`${this.apiUrl}/cita/${citaId}/estado`, payload)
      .subscribe({
        next: () => {
          this._citasAgenda.update(citas =>
            citas.map(c => c.id_cita === citaId ? { ...c, estado: nuevoEstado } : c)
          );
        },
        error: (err) => console.error('Error al mutar el estado clínico:', err)
      });
  }

  // === MÉTODOS DINÁMICOS CONECTADOS AL BACKEND ===

  cargarPerfil(): void {
    this.http.get<PerfilMedico>(`${this.apiUrl}/perfil`).subscribe({
      next: (perfilData) => this._perfil.set(perfilData),
      error: (err) => console.error('Error al descargar el perfil desde Supabase:', err)
    });
  }

  actualizarPerfil(datosActualizados: PerfilMedico): void {
    this.http.put<{ status: string, message: string }>(`${this.apiUrl}/perfil`, datosActualizados)
      .subscribe({
        next: () => {
          this._perfil.set({ ...datosActualizados });
          
        },
        error: (err) => console.error('Error al persistir el perfil médico:', err)
      });
  }
}