import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent {
  private usuarioAdminService = inject(AdminService);

  // Inyección del listado global inmutable
  public todosLosUsuarios = this.usuarioAdminService.usuariosMaster;

  // SIGNAL MUTABLE: Controla el filtro de roles seleccionado por el panel
  public filtroRol = signal<string>('TODOS');

  // COMPUTED: Filtrado de datos reactivo y automático basado en la señal del filtro
  public usuariosFiltrados = computed(() => {
    const rolSeleccionado = this.filtroRol();
    if (rolSeleccionado === 'TODOS') {
      return this.todosLosUsuarios();
    }
    return this.todosLosUsuarios().filter(u => u.rol === rolSeleccionado);
  });

  // Acciones transaccionales directas del sistema
  public cambiarEstadoAcceso(usuarioId: number): void {
    this.usuarioAdminService.conmutarEstadoCuenta(usuarioId);
  }
}