import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
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
export class PerfilPacienteComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  public perfilOriginal = this.pacienteService.perfil;

  // SIGNAL FORMS: Inicialización segura para enlazado en vistas
  public telefono = signal<string>('');
  public direccionResidencia = signal<string>('');
  public contactoNombre = signal<string>('');
  public contactoTelefono = signal<string>('');

  constructor() {
    // Escucha de manera reactiva la respuesta asíncrona del backend
    effect(() => {
      const datos = this.perfilOriginal();
      if (datos) {
        this.telefono.set(datos.telefono || '');
        this.direccionResidencia.set(datos.direccionResidencia || '');
        this.contactoNombre.set(datos.contactoEmergenciaNombre || '');
        this.contactoTelefono.set(datos.contactoEmergenciaTelefono || '');
      }
    });
  }

  ngOnInit(): void {
    this.pacienteService.cargarPerfil();
  }

  // VALIDACIONES
  public esTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.telefono()));
  public esContactoTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.contactoTelefono()));
  public esDireccionValida = computed(() => this.direccionResidencia().trim().length >= 8);
  public esContactoNombreValido = computed(() => this.contactoNombre().trim().length >= 3);

  public esFormularioValido = computed(() => 
    this.esTelefonoValido() && 
    this.esContactoTelefonoValido() && 
    this.esDireccionValida() && 
    this.esContactoNombreValido()
  );

  // DETECCIÓN DE CAMBIOS REALES CONTRA LA BASE DE DATOS
  public tieneCambios = computed(() => {
    const original = this.perfilOriginal();
    if (!original) return false;

    return this.telefono() !== original.telefono ||
           this.direccionResidencia() !== original.direccionResidencia ||
           this.contactoNombre() !== original.contactoEmergenciaNombre ||
           this.contactoTelefono() !== original.contactoEmergenciaTelefono;
  });

  public get infoInmutable() {
    return this.perfilOriginal() || {
      nombreCompleto: 'Cargando Paciente...',
      dni: '.........',
      correo: '...',
      grupoSanguineo: 'O+'
    };
  }

  guardarCambios(): void {
    const original = this.perfilOriginal();
    if (!this.esFormularioValido() || !this.tieneCambios() || !original) return;

    const payload: PerfilPaciente = {
      ...original,
      telefono: this.telefono(),
      direccionResidencia: this.direccionResidencia(),
      contactoEmergenciaNombre: this.contactoNombre(),
      contactoEmergenciaTelefono: this.contactoTelefono()
    };

    this.pacienteService.actualizarPerfil(payload);
  }
}