export type RolUsuario = 'ADMINISTRADOR' | 'MEDICO' | 'PACIENTE' | null;

export interface LoginData {
  email: string;
  password: string;
}

// Estructura del usuario autenticado devuelto por la sesión
export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: RolUsuario;
  token: string;
}