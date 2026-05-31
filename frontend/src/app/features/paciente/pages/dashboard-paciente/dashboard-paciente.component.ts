import { Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { PacienteService } from '../../services/paciente.service';

@Component({
    selector: 'app-dashboard-paciente',
    imports: [RouterLink],
    templateUrl: './dashboard-paciente.component.html',
    styleUrls: ['./dashboard-paciente.component.scss']
})
export class DashboardPacienteComponent {
  // Inyectamos el servicio para tener acceso directo a la Signal de citas en el HTML
  public pacienteService = inject(PacienteService);
}