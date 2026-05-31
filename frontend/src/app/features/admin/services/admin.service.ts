import { Injectable, inject, computed, signal } from '@angular/core';
import { PacienteService } from '../../paciente/services/paciente.service';
import { MedicoService } from '../../medico/services/medico.service';
import { UsuarioAuditoria } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Inyección de dependencias de los cores de negocio existentes
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);

  // SIGNALS COMPUTADAS AVANZADAS: Procesan KPIs en tiempo real cruzando múltiples estados
  public totalMedicosActivos = computed(() => this.pacienteService.medicos().length);
  
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


  // Estado inicial reactivo de las cuentas de usuario registradas
  private _usuariosMaster = signal<UsuarioAuditoria[]>([
    {
      id: 1,
      nombreCompleto: 'Ricardo Miguel Flores Toribio',
      correo: 'ricardo.flores@hospital.com',
      rol: 'PACIENTE',
      fechaRegistro: '2026-04-10',
      estadoCuenta: 'ACTIVO',
      ultimaConexion: '2026-05-31 15:30'
    },
    {
      id: 2,
      nombreCompleto: 'Dr. Carlos Mendoza Arana',
      correo: 'carlos.mendoza@hospital.com',
      rol: 'MEDICO',
      fechaRegistro: '2025-09-20',
      estadoCuenta: 'ACTIVO',
      ultimaConexion: '2026-05-31 16:15'
    },
    {
      id: 3,
      nombreCompleto: 'Camila San Martín Vega',
      correo: 'camila.sanmartin@hospital.com',
      rol: 'PACIENTE',
      fechaRegistro: '2026-05-02',
      estadoCuenta: 'ACTIVO',
      ultimaConexion: '2026-05-30 11:00'
    },
    {
      id: 4,
      nombreCompleto: 'Admin General Corporativo',
      correo: 'admin.ops@hospital.com',
      rol: 'ADMINISTRADOR',
      fechaRegistro: '2025-01-15',
      estadoCuenta: 'ACTIVO',
      ultimaConexion: '2026-05-31 16:30'
    }
  ]);

  public usuariosMaster = this._usuariosMaster.asReadonly();

  /**
   * Modifica transaccionalmente el acceso de seguridad de un usuario
   */
  conmutarEstadoCuenta(usuarioId: number): void {
    this._usuariosMaster.update(lista =>
      lista.map(u => {
        if (u.id === usuarioId) {
          const nuevoEstado = u.estadoCuenta === 'ACTIVO' ? 'SUSPENDIDO' : 'ACTIVO';
          return { ...u, estadoCuenta: nuevoEstado };
        }
        return u;
      })
    );
  }



}