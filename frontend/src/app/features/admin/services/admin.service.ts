import { Injectable, inject, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // <-- Añadido para la API
import { environment } from '../../../../environments/environment.js';
import { PacienteService } from '../../paciente/services/paciente.service';
import { MedicoService } from '../../medico/services/medico.service';
import { Observable, tap } from 'rxjs';

// Interfaz que mapea exactamente lo que devuelve tu backend (Supabase + FastAPI)
export interface UsuarioAPI {
  id_usuario: number;
  nombre: string;
  correo: string;
  id_rol: number;  // 10: ADMIN, 11: MEDICO, 12: PACIENTE
  activo: boolean;
  creado_en: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Inyección de dependencias de los cores de negocio existentes y HTTP
  private http = inject(HttpClient); 
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);

  // URL dinámica construida desde tu archivo environment
  private apiUrl = `${environment.apiUrl}/usuarios`;

  // SIGNALS COMPUTADAS AVANZADAS: Procesan KPIs en tiempo real cruzando múltiples estados (SE MANTIENEN INTACTAS)
  //public totalMedicosActivos = computed(() => this.pacienteService.medicos().length);
  public totalMedicosActivos = computed(() => {
    return this.usuariosMaster().filter(usuario => usuario.id_rol === 11).length;
  });
  
  public totalCitasGlobales = computed(() => {
    // Une las citas de auditoría con las del módulo transaccional de pacientes
    return this.pacienteService.citas().length + this.medicoService.citasAgenda().length;
  });

  public totalCitasConfirmadas = computed(() => {
    const totalP = this.pacienteService.citas().filter(c => c.estado === 'CONFIRMADA').length;
    const totalM = this.medicoService.citasAgenda().filter(c => c.estado === 'CONFIRMADA').length;
    return totalP + totalM;
  });

  public totalCitasAtendidas = computed(() => {
    const totalP = this.pacienteService.citas().filter(c => c.estado === 'ATENDIDA').length;
    const totalM = this.medicoService.citasAgenda().filter(c => c.estado === 'ATENDIDA').length;
    return totalP + totalM;
  });

  public tasaOcupacionClinica = computed(() => {
    const globales = this.totalCitasGlobales();
    if (globales === 0) return 0;
    // Calcula el porcentaje analítico de éxito operacional
    return Math.round((this.totalCitasAtendidas() / globales) * 100);
  });

  // SIGNAL MUTABLE CENTRALIZADA: Ahora inicializa vacía mapeando a UsuarioAPI
  private _usuariosMaster = signal<UsuarioAPI[]>([]);
  public usuariosMaster = this._usuariosMaster.asReadonly();

  /**
   * Obtiene la lista de usuarios desde la API de FastAPI y actualiza la señal master
   */
  public cargarUsuarios(): void {
    this.http.get<UsuarioAPI[]>(this.apiUrl).subscribe({
      next: (usuarios) => {
        console.log('USUARIOS DESDE LA API:', usuarios);
        this._usuariosMaster.set(usuarios);
      },
      error: (err) => {
        console.error('Error al recuperar el listado de usuarios de la API:', err);
      }
    });
  }

  /**
   * Envía los datos del nuevo usuario a FastAPI y actualiza el estado local en tiempo real
   */
  public registrarUsuario(nuevoUsuario: any): Observable<UsuarioAPI> {
    return this.http.post<UsuarioAPI>(this.apiUrl, nuevoUsuario).pipe(
      tap((usuarioCreado) => {
        // Inserta de forma reactiva el usuario retornado por el backend a la lista master
        this._usuariosMaster.update(lista => [...lista, usuarioCreado]);
      })
    );
  }

  /**
   * Modifica transaccionalmente el acceso de seguridad de un usuario
   */
  conmutarEstadoCuenta(usuarioId: number): void {
    this._usuariosMaster.update(lista =>
      lista.map(u => {
        if (u.id_usuario === usuarioId) {
          return { ...u, activo: !u.activo };
        }
        return u;
      })
    );
  }
}