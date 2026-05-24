import { Injectable, signal, computed } from '@angular/core';
import { UsuarioAdmin, Metricashome } from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // Estado local reactivo de usuarios de la clínica (Mock)
  private _usuarios = signal<UsuarioAdmin[]>([
    { id: 1, nombre: 'Dr. Carlos Mendoza', correo: 'c.mendoza@medicore.com', rol: 'MEDICO', estado: 'ACTIVO' },
    { id: 2, nombre: 'Dra. Ana Rivas', correo: 'a.rivas@medicore.com', rol: 'MEDICO', estado: 'ACTIVO' },
    { id: 3, nombre: 'Dra. Sofía Castro', correo: 's.castro@medicore.com', rol: 'MEDICO', estado: 'INACTIVO' },
    { id: 4, nombre: 'Ricardo Almonacid', correo: 'ricardo@student.com', rol: 'PACIENTE', estado: 'ACTIVO' },
    { id: 5, nombre: 'María Elena Flores', correo: 'maria.flores@gmail.com', rol: 'PACIENTE', estado: 'ACTIVO' }
  ]);

  public usuarios = this._usuarios.asReadonly();

  // Signals Computadas: Calculan analíticas en tiempo real para el Centro de Control
  public metricas = computed<Metricashome>(() => {
    const list = this._usuarios();
    return {
      totalPacientes: list.filter(u => u.rol === 'PACIENTE').length,
      totalMedicos: list.filter(u => u.rol === 'MEDICO' && u.estado === 'ACTIVO').length,
      citasAgendadas: 24, // Simulación de control de citas
      eficienciaAtencion: '94.2%'
    };
  });

  /**
   * Cambia el estado (Activo/Inactivo) de un usuario en el sistema
   */
  alternarEstadoUsuario(id: number): void {
    this._usuarios.update(users =>
      users.map(u => u.id === id ? { ...u, estado: u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : u)
    );
  }

  /**
   * Registra un nuevo profesional o paciente en el listado centralizado
   */
  crearUsuario(nuevo: Omit<UsuarioAdmin, 'id' | 'estado'>): void {
    const usuarioCompleto: UsuarioAdmin = {
      id: Math.floor(Math.random() * 10000),
      estado: 'ACTIVO',
      ...nuevo
    };
    this._usuarios.update(users => [...users, usuarioCompleto]);
  }
}