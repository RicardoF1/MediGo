import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-paciente.component.html',
  styleUrls: ['./perfil-paciente.component.scss']
})
export class PerfilPacienteComponent {
  public authService = inject(AuthService);

  // Estados locales reactivos usando Signals para simular edición de datos de contacto
  public telefono = signal<string>('+51 987 654 321');
  public direccion = signal<string>('Av. Giraldez 456, Huancayo');

  guardarDatosContacto(): void {
    alert('💾 Datos de contacto actualizados correctamente en el Frontend del perfil.');
  }
}