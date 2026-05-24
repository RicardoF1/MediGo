export interface UsuarioAdmin {
  id: number;
  nombre: string;
  correo: string;
  rol: 'MEDICO' | 'PACIENTE';
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Metricashome {
  totalPacientes: number;
  totalMedicos: number;
  citasAgendadas: number;
  eficienciaAtencion: string;
}