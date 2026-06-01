import { Injectable, signal, computed } from '@angular/core';
import { RolUsuario, UsuarioSesion } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Estado maestro inmutable (Inicia en null para que pida login obligatoriamente)
  private _usuarioLogueado = signal<UsuarioSesion | null>(null);
  
  public usuarioLogueado = this._usuarioLogueado.asReadonly();


  public isAuthenticated = computed(() => this._usuarioLogueado() !== null);

  
  public userRole = computed(() => {
    const rol = this._usuarioLogueado()?.rol;
    
    if (rol === 'ADMINISTRADOR') return 'ADMIN';
    return rol ?? '';
  });


  public currentUser = computed(() => this._usuarioLogueado());


  public rolActual = computed(() => this._usuarioLogueado()?.rol ?? null);


  public rutaInicioPorRol = computed(() => {
    const rol = this.rolActual();
    switch (rol) {
      case 'ADMINISTRADOR':
        return '/admin/dashboard-admin'; 
      case 'MEDICO':
        return '/medico'; // Redirige al path raíz médico
      case 'PACIENTE':
        return '/paciente'; // Redirige al path raíz paciente
      default:
        return '/auth/login'; 
    }
  });

  // Método de cierre de sesión 
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