import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  private usuarioAdminService = inject(AdminService);
  private fb = inject(FormBuilder);

  public todosLosUsuarios = this.usuarioAdminService.usuariosMaster;
  public filtroRol = signal<string>('TODOS');
  public mostrarFormularioRegistro = signal<boolean>(false);
  public usuarioForm!: FormGroup;
  
  // Estado para bloquear el botón de guardado mientras procesa el HTTP POST
  public guardando = signal<boolean>(false);

  constructor() {
    this.inicializarFormulario();
  }

  ngOnInit(): void {
    this.usuarioAdminService.cargarUsuarios();
  }

  private inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      nombre: ['', [
        Validators.required, 
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras y espacios
      ]],
      correo: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) // Formato estricto de email
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/) // Al menos una letra y un número
      ]],
      id_rol: [12, [Validators.required]]
    });
  }

  // Helpers para simplificar la validación en el HTML
  public esCampoInvalido(campo: string): boolean {
    const control = this.usuarioForm.get(campo);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  public usuariosFiltrados = computed(() => {
    const seleccion = this.filtroRol();
    const listaOriginal = this.todosLosUsuarios();
    if (seleccion === 'TODOS') return listaOriginal;
    return listaOriginal.filter(u => u.id_rol === parseInt(seleccion, 10));
  });

  public guardarNuevoUsuario(): void {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true); // Deshabilita el botón para evitar doble submit
    const payload = this.usuarioForm.value;

    this.usuarioAdminService.registrarUsuario(payload).subscribe({
      next: () => {
        alert('Usuario registrado exitosamente.');
        this.usuarioForm.reset({ id_rol: 12 });
        this.mostrarFormularioRegistro.set(false);
        this.guardando.set(false);
      },
      error: (err) => {
        this.guardando.set(false);
        console.error('Error en la API:', err);
        // Captura el mensaje HTTP 400 "El correo electrónico ya se encuentra registrado" desde FastAPI
        const mensajeError = err.error?.detail || 'Ocurrió un error inesperado al registrar el usuario.';
        alert(mensajeError);
      }
    });
  }

  public cambiarEstadoAcceso(usuarioId: number): void {
    this.usuarioAdminService.conmutarEstadoCuenta(usuarioId);
  }
}