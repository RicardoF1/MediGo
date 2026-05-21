import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100 bg-light">
      
      @if (authService.isAuthenticated()) {
        <app-navbar></app-navbar>
      }

      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>

      @if (authService.isAuthenticated()) {
        <app-footer></app-footer>
      }

    </div>
  `,
  //templateUrl: './app.component.html',
  //styleUrl: './app.component.scss'
})
export class AppComponent {
  public authService = inject(AuthService); // Inyectamos el servicio para escuchar las Signals de sesión
}

 