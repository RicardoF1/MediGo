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
   * Módulo de Acceso Rápido
   */
  public cargarAccesoRapido(rol: 'ADMIN' | 'MEDICO' | 'PACIENTE'): void {
    this.errorLogin.set(null);
    this.emailTocado.set(true);
    this.passwordTocado.set(true);

    if (rol === 'ADMIN') {
      this.loginForm.email().value.set('admin.auditoria@hospital.com');
      this.loginForm.password().value.set('admin12345');
    } else if (rol === 'MEDICO') {
      this.loginForm.email().value.set('medico.carlos@hospital.com');
      this.loginForm.password().value.set('medico12345');
    } else if (rol === 'PACIENTE') {
      this.loginForm.email().value.set('ricardo.flores@hospital.com');
      this.loginForm.password().value.set('paciente12345');
    }
  }

  manejarLogin(event: Event): void {
    event.preventDefault();
    
    this.emailTocado.set(true);
    this.passwordTocado.set(true);

    if (!this.esFormularioValido()) return;

    this.cargando.set(true);
    this.errorLogin.set(null);

    setTimeout(() => {
      const email = this.loginForm.email().value().toLowerCase().trim();
      
      if (email.includes('admin')) {
        this.authService.simularLogin('ADMINISTRADOR');
      } else if (email.includes('medico') || email.includes('carlos')) {
        this.authService.simularLogin('MEDICO');
      } else {
        this.authService.simularLogin('PACIENTE');
      }

      this.cargando.set(false);
      this.router.navigateByUrl(this.authService.rutaInicioPorRol());
    }, 1200);
  }
}