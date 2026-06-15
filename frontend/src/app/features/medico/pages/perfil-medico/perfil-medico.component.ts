import { Component, inject, signal, computed, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoService } from '../../services/medico.service';
import { PerfilMedico } from '../../models/agenda.model';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-medico.component.html',
  styleUrls: ['./perfil-medico.component.scss']
})
export class PerfilMedicoComponent implements OnInit {
  private medicoService = inject(MedicoService);
  public perfilOriginal = this.medicoService.perfil;

  // SIGNALS FORMULARIO: Ahora incluimos nombre y correo para que se puedan editar
  public nombreCompleto = signal<string>('');
  public correo = signal<string>('');
  public telefono = signal<string>('');
  public consultorio = signal<string>('');
  public activoParaCitas = signal<boolean>(true);

  constructor() {
    effect(() => {
      const datos = this.perfilOriginal();
      if (datos) {
        this.nombreCompleto.set(datos.nombreCompleto || '');
        this.correo.set(datos.correo || '');
        this.telefono.set(datos.telefono || '');
        this.consultorio.set(datos.consultorio || '');
        this.activoParaCitas.set(datos.activoParaCitas);
      }
    });
  }

  ngOnInit(): void {
    this.medicoService.cargarPerfil();
  }

  // VALIDACIONES REACTIVAS EXPANDIDAS
  public esNombreValido = computed(() => this.nombreCompleto().trim().length >= 3);
  public esCorreoValido = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.correo()));
  public esTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.telefono()));
  public esConsultorioValido = computed(() => this.consultorio().trim().length >= 4);

  public esFormularioValido = computed(() => 
    this.esNombreValido() && 
    this.esCorreoValido() && 
    this.esTelefonoValido() && 
    this.esConsultorioValido()
  );

  // DETECTA CAMBIOS EN CUALQUIERA DE LOS 5 CAMPOS
  public tieneCambios = computed(() => {
    const original = this.perfilOriginal();
    if (!original) return false;
    
    return this.nombreCompleto() !== original.nombreCompleto ||
           this.correo() !== original.correo ||
           this.telefono() !== original.telefono ||
           this.consultorio() !== original.consultorio ||
           this.activoParaCitas() !== original.activoParaCitas;
  });

  public get infoFija() {
    return this.perfilOriginal() || {
      nombreCompleto: 'Cargando...',
      especialidad: 'Cargando...',
      colegiatura: '...',
      correo: '...'
    };
  }

  guardarPerfil(): void {
    const original = this.perfilOriginal();
    if (!this.esFormularioValido() || !this.tieneCambios() || !original) return;

    // El payload ahora lleva los nuevos valores editados del formulario
    const payload: PerfilMedico = {
      ...original,
      nombreCompleto: this.nombreCompleto(),
      correo: this.correo(),
      telefono: this.telefono(),
      consultorio: this.consultorio(),
      activoParaCitas: this.activoParaCitas()
    };

    this.medicoService.actualizarPerfil(payload);
  }
}