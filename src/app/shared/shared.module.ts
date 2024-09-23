import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { AppRoutingModule } from '../app-routing.module';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { EtiquetaValorComponent } from '../components/etiqueta-valor/etiqueta-valor.component';
import { ClienteDatosGeneralesComponent } from '../components/cliente-datos-generales/cliente-datos-generales.component';
import { ClienteEconomicosComponent } from '../components/cliente-economicos/cliente-economicos.component';
import { ClienteMasInfoComponent } from '../components/cliente-mas-info/cliente-mas-info.component';
import { PopupHeaderComponent } from '../components/popup-header/popup-header.component';

@NgModule({
  declarations: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    EtiquetaValorComponent,
    ClienteDatosGeneralesComponent,
    ClienteEconomicosComponent,
    ClienteMasInfoComponent,
    PopupHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule 

  ],
  exports: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    EtiquetaValorComponent,
    ClienteDatosGeneralesComponent,
    ClienteEconomicosComponent,
    ClienteMasInfoComponent,
    PopupHeaderComponent
  ]
})
export class SharedModule { }