export type UserRole = 'PACIENTE' | 'MEDICO' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  role: UserRole;
  token?: string;
}