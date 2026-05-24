import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent {
  public adminService = inject(AdminService);

  // Estados reactivos para el formulario de inserción
  public nombreInput = signal<string>('');
  public correoInput = signal<string>('');
  public rolInput = signal<'MEDICO' | 'PACIENTE'>('MEDICO');

  registrarNuevoUsuario(): void {
    if (!this.nombreInput().trim() || !this.correoInput().trim()) return;

    this.adminService.crearUsuario({
      nombre: this.nombreInput(),
      correo: this.correoInput(),
      rol: this.rolInput()
    });

    alert('🎉 Usuario dado de alta en la plataforma MediCore con estado ACTIVO.');
    // Limpiar campos
    this.nombreInput.set('');
    this.correoInput.set('');
  }
}