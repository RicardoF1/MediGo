import { Injectable, signal, computed, effect } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1. Signal privada para almacenar el usuario actual (Estado del servicio)
  private _currentUser = signal<User | null>(null);

  // 2. Signals públicas expuestas (Solo lectura) para ser consumidas por los componentes
  public currentUser = this._currentUser.asReadonly();
  
  // 3. Signal computada: Calcula automáticamente si el usuario está autenticado
  public isAuthenticated = computed(() => this._currentUser() !== null);
  
  // 4. Signal computada: Retorna el rol del usuario actual o null si no hay sesión
  public userRole = computed(() => this._currentUser()?.role || null);

  constructor() {
    // Al iniciar la aplicación, verificamos si hay una sesión guardada en el navegador
    const savedUser = localStorage.getItem('medicore_session');
    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('medicore_session');
      }
    }

    // Efecto reactivo: Cada vez que _currentUser cambie, se actualiza automáticamente el localStorage
    effect(() => {
      const user = this._currentUser();
      if (user) {
        localStorage.setItem('medicore_session', JSON.stringify(user));
      } else {
        localStorage.removeItem('medicore_session');
      }
    });
  }

  /**
   * Simula el inicio de sesión para el desarrollo del Frontend-First
   */
  public loginMock(role: UserRole): void {
    const mockUser: User = {
      id: Math.floor(Math.random() * 100),
      username: `${role.toLowerCase()}_user`,
      nombre: 'Usuario',
      apellido: role,
      email: `${role.toLowerCase()}@medicore.com`,
      role: role,
      token: 'mock-jwt-token-response'
    };
    
    // Al actualizar esta Signal, toda la aplicación que dependa de ella se redibujará
    this._currentUser.set(mockUser);
  }

  /**
   * Cierra la sesión limpiando el estado reactivo
   */
  public logout(): void {
    this._currentUser.set(null);
  }
}