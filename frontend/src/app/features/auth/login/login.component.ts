import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div class="card shadow-lg border-0" style="max-width: 450px; width: 100%;">
        <div class="card-body p-5">
          
          <div class="text-center mb-4">
            <h2 class="fw-bold text-primary">MediCore</h2>
            <p class="text-muted fs-6">Gestión de Citas Médicas</p>
          </div>

          @if (errorMessage()) {
            <div class="alert alert-danger d-flex align-items-center py-2" role="alert">
              <small>{{ errorMessage() }}</small>
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
            
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold text-secondary">Correo Electrónico</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="form-control form-control-lg" 
                [ngClass]="{'is-invalid': isFieldInvalid('email'), 'is-valid': loginForm.get('email')?.valid}"
                placeholder="ejemplo@medicore.com">
              <div class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>

            <div class="mb-4">
              <label for="password" class="form-label fw-semibold text-secondary">Contraseña</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password"
                class="form-control form-control-lg" 
                [ngClass]="{'is-invalid': isFieldInvalid('password'), 'is-valid': loginForm.get('password')?.valid}"
                placeholder="••••••••">
              <div class="invalid-feedback">
                La contraseña debe tener al menos 6 caracteres.
              </div>
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
              [disabled]="isLoading() || loginForm.invalid">
              @if (isLoading()) {
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Autenticando...
              } @else {
                Iniciar Sesión
              }
            </button>
          </form>

          <div class="mt-4 pt-3 border-top text-center">
            <p class="small text-muted mb-2">Accesos rápidos de desarrollo:</p>
            <div class="d-flex justify-content-center gap-1">
              <button (click)="loginRapido('PACIENTE')" class="btn btn-sm btn-outline-secondary">Paciente</button>
              <button (click)="loginRapido('MEDICO')" class="btn btn-sm btn-outline-secondary">Médico</button>
              <button (click)="loginRapido('ADMIN')" class="btn btn-sm btn-outline-secondary">Admin</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Signals para manejar estados asíncronos y visuales localmente
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  // Inicialización del formulario con validaciones estrictas
  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  /**
   * Helper para verificar si un campo debe mostrar error visual de Bootstrap
   */
  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /**
   * Manejador del envío del formulario
   */
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    // Simulamos un retraso de red de 1.5 segundos (Mocking profesional)
    setTimeout(() => {
      const { email, password } = this.loginForm.value;

      // Validación fija para pruebas (puedes cambiarla después al conectar tu base de datos)
      if (email === 'admin@medicore.com' && password === '123456') {
        this.authService.loginMock('ADMIN');
        this.isLoading.set(false);
        this.router.navigate(['/admin']); // Cambia según la ruta
      } else if (email === 'medico@medicore.com' && password === '123456') {
        this.authService.loginMock('MEDICO');
        this.isLoading.set(false);
        this.router.navigate(['/medico']);
      } else if (email === 'paciente@medicore.com' && password === '123456') {
        this.authService.loginMock('PACIENTE');
        this.isLoading.set(false);
        this.router.navigate(['/paciente']);
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('Credenciales incorrectas. Pruebe con las credenciales de desarrollo.');
      }
    }, 1500);
  }

  /**
   * Acceso rápido para agilizar las pruebas del profesor y del equipo de desarrollo
   */
  loginRapido(role: 'PACIENTE' | 'MEDICO' | 'ADMIN'): void {
    this.authService.loginMock(role);
    this.router.navigate([`/${role.toLowerCase()}`]);
  }
}

/* @Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``
}) */
