export interface MetricasClinicaUI {
  totalPacientesAsegurados: number;
  totalMedicosStaff: number;
  citasTotales: number;
  citasAtendidas: number;
  citasCanceladas: number;
  eficienciaAtencion: number;
}

export interface UsuarioAuditoria {
  id: number;
  nombreCompleto: string;
  correo: string;
  rol: 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE';
  fechaRegistro: string;
  estadoCuenta: 'ACTIVO' | 'SUSPENDIDO';
  ultimaConexion: string;
}

