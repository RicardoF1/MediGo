export interface Cita {
  id: number;
  pacienteId: number;
  medicoId: number;
  medicoNombre: string;
  especialidadNombre: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
}