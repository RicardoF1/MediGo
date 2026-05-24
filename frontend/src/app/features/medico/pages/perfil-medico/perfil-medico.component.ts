import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-medico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-medico.component.html',
  styleUrls: ['./perfil-medico.component.scss']
})
export class PerfilMedicoComponent {
  public authService = inject(AuthService);

  // Estados locales reactivos controlados por Signals para simular cambios de consultorio y contacto
  public consultorio = signal<string>('Consultorio 304 - Piso 3 (Ala Norte)');
  public telefonoContacto = signal<string>('+51 912 345 678');
  public estadoDisponibilidad = signal<boolean>(true); // True: Disponible para emergencias

  guardarConfiguracion(): void {
    alert('💾 Configuración profesional y de consultorio actualizada con éxito en el Frontend.');
  }
}