import { Component, inject, signal, computed } from '@angular/core';
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
export class PerfilMedicoComponent {
  private medicoService = inject(MedicoService);

  // Datos originales del servicio
  private perfilOriginal = this.medicoService.perfil;

  // SIGNAL FORMS: Propiedades reactivas independientes para la edición
  public telefono = signal<string>(this.perfilOriginal().telefono);
  public consultorio = signal<string>(this.perfilOriginal().consultorio);
  public activoParaCitas = signal<boolean>(this.perfilOriginal().activoParaCitas);

  // VALIDACIONES EN TIEMPO REAL (Signal Forms Pattern)
  public esTelefonoValido = computed(() => /^[0-9]{9}$/.test(this.telefono()));
  public esConsultorioValido = computed(() => this.consultorio().trim().length >= 5);

  public esFormularioValido = computed(() => this.esTelefonoValido() && this.esConsultorioValido());

  // COMPUTED: Detecta de manera reactiva si hay cambios reales frente al servicio
  public tieneCambios = computed(() => {
    return this.telefono() !== this.perfilOriginal().telefono ||
           this.consultorio() !== this.perfilOriginal().consultorio ||
           this.activoParaCitas() !== this.perfilOriginal().activoParaCitas;
  });

  // Getter para los campos informativos fijos
  public get infoFija() {
    return this.perfilOriginal();
  }

  guardarPerfil(): void {
    if (!this.esFormularioValido() || !this.tieneCambios()) return;

    const payload: PerfilMedico = {
      ...this.perfilOriginal(),
      telefono: this.telefono(),
      consultorio: this.consultorio(),
      activoParaCitas: this.activoParaCitas()
    };

    this.medicoService.actualizarPerfil(payload);
    alert('💾 Configuración profesional actualizada correctamente en el sistema.');
  }
}