import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RolUsuario, UsuarioSesion } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyectamos HttpClient de Angular
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Estado maestro reactivo (Inicia leyendo localStorage para persistencia)
  private _usuarioLogueado = signal<UsuarioSesion | null>(this.obtenerSesionInicial());
  
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
        return '/medico'; 
      case 'PACIENTE':
        return '/paciente'; 
      default:
        return '/auth/login'; 
    }
  });

  /**
   * Petición HTTP Real al Backend de FastAPI para iniciar sesión
   */
  public login(correo: string, password: string): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(`${this.apiUrl}/login`, { correo, password }).pipe(
      tap((usuario: UsuarioSesion) => {
        // En tu backend, si 'ADMINISTRADOR' llega abreviado como 'ADMIN', lo normalizamos aquí:
        if ((usuario.rol as string) === 'ADMIN') {
          usuario.rol = 'ADMINISTRADOR';
        }

        // 1. Guardamos en el almacenamiento local para persistencia
        localStorage.setItem('medicore_session', JSON.stringify(usuario));
        
        // 2. Actualizamos la Signal reactiva que controla todo el frontend
        this._usuarioLogueado.set(usuario);
      })
    );
  }

  // Cierre de sesión real limpiando estado y caché
  public logout(): void {
    localStorage.removeItem('medicore_session');
    this._usuarioLogueado.set(null);
  }

  /**
   * Recupera la sesión guardada para que no se borre al presionar F5
   */
  private obtenerSesionInicial(): UsuarioSesion | null {
    const sesionGuardada = localStorage.getItem('medicore_session');
    if (sesionGuardada) {
      try {
        return JSON.parse(sesionGuardada) as UsuarioSesion;
      } catch (e) {
        localStorage.removeItem('medicore_session');
        return null;
      }
    }
    return null;
  }

  /**
   * Mantenemos tu simulación por si la necesitas para testing rápido
   */
  public simularLogin(nuevoRol: RolUsuario): void {
    const nombresMocks: Record<string, string> = {
      'ADMINISTRADOR': 'Admin General Corporativo',
      'MEDICO': 'Dr. Carlos Mendoza Arana',
      'PACIENTE': 'Ricardo Miguel Flores Toribio'
    };

    if (nuevoRol) {
      const usuarioMock: UsuarioSesion = {
        id: Math.floor(Math.random() * 900) + 100,
        nombre: nombresMocks[nuevoRol] || 'Usuario Sistema',
        correo: `${nuevoRol.toLowerCase()}@hospital.com`,
        rol: nuevoRol,
        token: 'jwt-new-token-abc'
      };
      localStorage.setItem('medicore_session', JSON.stringify(usuarioMock));
      this._usuarioLogueado.set(usuarioMock);
    } else {
      this.logout();
    }
  }
}