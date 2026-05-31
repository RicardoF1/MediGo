export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  motivoConsulta?: string;
}

export interface MedicoUI {
  id: number;
  nombre: string;
  especialidadId: number;
  avatar: string;
  disponibilidad: string[];
  calificacion: number;
}