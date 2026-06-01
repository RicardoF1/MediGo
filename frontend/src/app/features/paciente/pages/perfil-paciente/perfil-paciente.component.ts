import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacienteService } from '../../services/paciente.service';
import { PerfilPaciente } from '../../models/paciente.model';

@Component({
  selector: 'app-perfil-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.scss']
})
export class PerfilPacienteComponent {
  private pacienteService = inject(PacienteService);

  // Datos originales guardados en el servicio
  private perfilOriginal = this.pacienteService.perfil;

  // SIGNAL FORMS: Estados independientes para los campos editables del formulario
  public telefono = signal<string>(this.perfilOriginal().telefono);
  public direccion = signal<string>(this.perfilOriginal().direccion);
  public contactoNombre = signal<string>(this.perfilOriginal().contactoEmergenciaNombre);
  public contactoTelefono = signal<string>(this.perfilOriginal().contactoEmergenciaTelefono);

  // VALIDACIONES
  // Regla: Teléfonos deben tener exactamente 9 dígitos y la dirección no estar vacía.
  public esTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.telefono()));
  public esContactoTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.contactoTelefono()));
  public esDireccionValida = computed(() => this.direccion().trim().length >= 8);
  public esContactoNombreValido = computed(() => this.contactoNombre().trim().length >= 3);

  // Validación global del formulario unificada
  public esFormularioValido = computed(() => 
    this.esTelefonoValido() && 
    this.esContactoTelefonoValido() && 
    this.esDireccionValida() && 
    this.esContactoNombreValido()
  );

  // COMPUTED: Detecta si el usuario realmente modificó algún dato frente al original
  public tieneCambios = computed(() => {
    return this.telefono() !== this.perfilOriginal().telefono ||
           this.direccion() !== this.perfilOriginal().direccion ||
           this.contactoNombre() !== this.perfilOriginal().contactoEmergenciaNombre ||
           this.contactoTelefono() !== this.perfilOriginal().contactoEmergenciaTelefono;
  });

  // Getter directo para los campos de solo lectura informativos
  public get infoInmutable() {
    return this.perfilOriginal();
  }

  guardarCambios(): void {
    if (!this.esFormularioValido() || !this.tieneCambios()) return;

    // Estructuramos el payload combinando lo inmutable con las señales editadas
    const payload: PerfilPaciente = {
      ...this.perfilOriginal(),
      telefono: this.telefono(),
      direccion: this.direccion(),
      contactoEmergenciaNombre: this.contactoNombre(),
      contactoEmergenciaTelefono: this.contactoTelefono()
    };

    this.pacienteService.actualizarPerfil(payload);
    alert('Datos de filiación y contacto actualizados exitosamente en el sistema.');
  }
}