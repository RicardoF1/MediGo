export interface CitaMedico {
  id_cita: number;       
  id_paciente: number;   
  paciente_nombre: string;
  fecha: string;         // 'YYYY-MM-DD'
  hora: string;          // 'HH:MM:SS' o string formateado
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  motivo: string;
}

export interface PerfilMedico {
  nombreCompleto: string;
  colegiatura: string;
  especialidad: string;
  correo: string;
  telefono: string;
  consultorio: string;
  activoParaCitas: boolean;
}