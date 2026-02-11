import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslationService } from 'src/app/core/services/i18n/translation.service';

import { FilterService } from 'src/app/services/filter/filter.service';
import { Empresa } from 'src/app/core/components/empresa-dropdown/empresa-dropdown.component';

@Component({
  selector: 'mobentis-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
})
export class DashboardGeneralComponent {
  selectedEmpresasIds: number[] = [];

  onEmpresasChange(empresas: Empresa[]): void {
    // Extraer solo los IDs de las empresas seleccionadas
    this.selectedEmpresasIds = empresas
      .filter(e => e.selected)
      .map(e => e.id);
    
    // Aquí se puede recargar datos del dashboard cuando se implemente la funcionalidad completa
    // this.loadDashboardData();
  }
}
