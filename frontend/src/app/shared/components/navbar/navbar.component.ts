import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  // Inyección pública para que la vista HTML consuma el servicio de forma directa
  public authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Ejecuta la transacción de cierre de sesión y redirige al login
   */
  public ejecutarLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}