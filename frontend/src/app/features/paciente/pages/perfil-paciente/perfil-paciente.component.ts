import { Component, signal, inject } from '@angular/core';

import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-perfil-paciente',
    imports: [FormsModule],
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