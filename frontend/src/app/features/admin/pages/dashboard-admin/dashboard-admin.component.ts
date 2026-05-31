import { Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-dashboard-admin',
    imports: [RouterLink],
    templateUrl: './dashboard-admin.component.html',
    styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent {
  public adminService = inject(AdminService);
}