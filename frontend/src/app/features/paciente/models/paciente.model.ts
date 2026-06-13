export interface PerfilPaciente {
  idPaciente?: number;
  nombreCompleto: string;
  dni: string;
  fechaNacimiento?: string;
  correo: string;
  telefono: string;
  direccionResidencia: string; 
  contactoEmergenciaNombre: string;
  contactoEmergenciaTelefono: string;
  grupoSanguineo: string; 
  historialClinicoNum?: string;
}