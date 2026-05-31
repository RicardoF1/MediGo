import { Injectable, signal, computed } from '@angular/core';
import { RolUsuario, UsuarioSesion } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado maestro inmutable (Inicia en null para que pida login obligatoriamente)
  private _usuarioLogueado = signal<UsuarioSesion | null>(null);
  
  public usuarioLogueado = this._usuarioLogueado.asReadonly();

  // ==========================================
  // COMPATIBILIDAD CON NAVBAR Y APP COMPONENT
  // ==========================================

  // 1. Reemplazo de isAuthenticated()
  public isAuthenticated = computed(() => this._usuarioLogueado() !== null);

  // 2. Reemplazo de userRole()
  public userRole = computed(() => {
    const rol = this._usuarioLogueado()?.rol;
    // Mapeo estricto para mantener la compatibilidad con el Navbar viejo ('ADMIN')
    if (rol === 'ADMINISTRADOR') return 'ADMIN';
    return rol ?? '';
  });

  // 3. Reemplazo de currentUser()
  public currentUser = computed(() => this._usuarioLogueado());

  // 4. Mapeo de rol estricto interno
  public rolActual = computed(() => this._usuarioLogueado()?.rol ?? null);

  /**
   * Dirección de redirección dinámica para el logotipo y el submit del Login.
   * CORREGIDO: Apunta exactamente a tus estructuras reales sin sub-paths ficticios.
   */
  public rutaInicioPorRol = computed(() => {
    const rol = this.rolActual();
    switch (rol) {
      case 'ADMINISTRADOR':
        return '/admin/dashboard-admin'; // Redirige a la subruta declarada en admin.routes
      case 'MEDICO':
        return '/medico'; // Redirige al path raíz funcional de tu submódulo médico
      case 'PACIENTE':
        return '/paciente'; // Redirige al path raíz funcional de tu submódulo paciente
      default:
        return '/auth/login'; // Retorno seguro a la pasarela externa
    }
  });

  /**
   * Método de cierre de sesión requerido por el Navbar
   */
  public logout(): void {
    this._usuarioLogueado.set(null);
  }

  /**
   * Simulación del inicio de sesión para desarrollo
   */
  public simularLogin(nuevoRol: RolUsuario): void {
    const nombresMocks: Record<string, string> = {
      'ADMINISTRADOR': 'Admin General Corporativo',
      'MEDICO': 'Dr. Carlos Mendoza Arana',
      'PACIENTE': 'Ricardo Miguel Flores Toribio'
    };

    if (nuevoRol) {
      this._usuarioLogueado.set({
        id: Math.floor(Math.random() * 900) + 100,
        nombre: nombresMocks[nuevoRol] || 'Usuario Sistema',
        correo: `${nuevoRol.toLowerCase()}@hospital.com`,
        rol: nuevoRol,
        token: 'jwt-new-token-abc'
      });
    } else {
      this.logout();
    }
  }
}