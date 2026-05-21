import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="footer mt-auto py-3 bg-white border-top text-center">
      <div class="container">
        <span class="text-muted small">
          &copy; 2026 <strong>MediCore Inc.</strong> — Sistema de Gestión Integrada de Citas Médicas. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      margin-top: auto;
    }
  `]
})
export class FooterComponent {}
/* import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styles: ``
})
export class FooterComponent {

}
 */