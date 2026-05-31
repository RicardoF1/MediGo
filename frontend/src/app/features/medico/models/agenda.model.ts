export interface CitaMedico {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  pacienteDni: string;
  fecha: string;
  hora: string;
  estado: 'PENDIENTE' | 'CONFIRMADA' | 'ATENDIDA' | 'CANCELADA';
  motivoConsulta: string;
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