import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { form, FormField } from '@angular/forms/signals'; 
import { AuthService } from '../../../core/services/auth.service';
import { LoginData } from '../../../core/models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormField], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Crear el modelo
  public loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  // Pasa el modelo a form() 
  public loginForm = form(this.loginModel);

  // Estados de control
  public emailTocado = signal<boolean>(false);
  public passwordTocado = signal<boolean>(false);

  // Estados de carga de la UI
  public cargando = signal<boolean>(false);
  public errorLogin = signal<string | null>(null);

  // Validaciones
  public emailErrores = computed(() => {
    const valor = this.loginForm.email().value().trim(); 
    if (!valor) return 'El correo electrónico es obligatorio.';
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(valor)) return 'Ingrese un formato de correo válido.';
    
    return null;
  });

  public passwordErrores = computed(() => {
    const valor = this.loginForm.password().value(); 
    if (!valor) return 'La contraseña es obligatoria.';
    if (valor.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    return null;
  });

  // Estado síncrono del formulario completo
  public esFormularioValido = computed(() => {
    return this.emailErrores() === null && this.passwordErrores() === null;
  });

  /**
   * Módulo de Acceso Rápido (Actualizado con contraseñas de prueba válidas)
   */
  public cargarAccesoRapido(rol: 'ADMIN' | 'MEDICO' | 'PACIENTE'): void {
    this.errorLogin.set(null);
    this.emailTocado.set(true);
    this.passwordTocado.set(true);

    if (rol === 'ADMIN') {
      this.loginForm.email().value.set('admin.auditoria@hospital.com');
      this.loginForm.password().value.set('$2b$12$K39uI9fC9KcXm01xyz...hash_simulado'); // Cambia por tu texto plano si lo editaste en Supabase
    } else if (rol === 'MEDICO') {
      this.loginForm.email().value.set('medico.carlos@hospital.com');
      this.loginForm.password().value.set('$2b$12$K39uI9fC9KcXm02xyz...hash_simulado');
    } else if (rol === 'PACIENTE') {
      this.loginForm.email().value.set('ricardo.flores@hospital.com');
      this.loginForm.password().value.set('$2b$12$K39uI9fC9KcXm03xyz...hash_simulado');
    }
  }

  /**
   * Envío del formulario al Backend Real de FastAPI
   */
  manejarLogin(event: Event): void {
    event.preventDefault();
    
    this.emailTocado.set(true);
    this.passwordTocado.set(true);

    if (!this.esFormularioValido()) return;

    this.cargando.set(true);
    this.errorLogin.set(null);

    const email = this.loginForm.email().value().toLowerCase().trim();
    const password = this.loginForm.password().value();

    // Consumimos el servicio HTTP real
    this.authService.login(email, password).subscribe({
      next: () => {
        // Apagamos el spinner de carga
        this.cargando.set(false);
        // Redirección reactiva utilizando tu propiedad computada de Signals
        this.router.navigateByUrl(this.authService.rutaInicioPorRol());
      },
      error: (err) => {
        this.cargando.set(false);
        // Si el backend responde 401 controlado, mostramos su detalle, si no, un error genérico
        if (err.status === 401 || err.status === 400) {
          this.errorLogin.set(err.error?.detail || 'Credenciales incorrectas');
        } else {
          this.errorLogin.set('No se pudo conectar con el servidor. Revisa tu backend.');
        }
        console.error('Error de autenticación:', err);
      }
    });
  }
}