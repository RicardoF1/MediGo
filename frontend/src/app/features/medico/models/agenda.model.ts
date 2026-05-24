export interface CitaMedico {
  id: number;
  pacienteNombre: string;
  pacienteEdad: number;
  hora: string;
  estado: 'PENDIENTE' | 'ATENDIDA' | 'CANCELADA';
  motivoConsulta?: string;
}