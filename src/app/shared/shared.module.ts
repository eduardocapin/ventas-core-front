import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { AppRoutingModule } from '../app-routing.module';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressCircleComponent } from '../components/progress-circle/progress-circle.component';
import { EtiquetaValorComponent } from '../components/etiqueta-valor/etiqueta-valor.component';
import { ClienteDatosGeneralesComponent } from '../components/cliente-datos-generales/cliente-datos-generales.component';
import { ClienteEconomicosComponent } from '../components/cliente-economicos/cliente-economicos.component';
import { ClienteMasInfoComponent } from '../components/cliente-mas-info/cliente-mas-info.component';
import { PopupHeaderComponent } from '../components/popup-header/popup-header.component';
import { DateFilterComponent } from '../components/filters/date-filter/date-filter.component';
import { SearchFilterComponent } from '../components/filters/search-filter/search-filter.component';
import { MultiSelectFilterComponent } from '../components/filters/multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from '../components/filters/range-filter/range-filter.component';
import { FilterContainerComponent } from '../components/filters/filter-container/filter-container.component';
import { MapComponent } from '../components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { BigIntPipe } from '../pipes/big-int.pipe';
import { NgbModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    BigIntPipe,
    PaginationComponent,
    ProgressCircleComponent,
    EtiquetaValorComponent,
    ClienteDatosGeneralesComponent,
    ClienteEconomicosComponent,
    ClienteMasInfoComponent,
    PopupHeaderComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
    FilterContainerComponent,
    MapComponent,
  ],
  imports: [
    NgbModule,
    NgbDatepickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgbTooltipModule, 

  ],
  exports: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    ProgressCircleComponent,
    EtiquetaValorComponent,
    ClienteDatosGeneralesComponent,
    ClienteEconomicosComponent,
    ClienteMasInfoComponent,
    PopupHeaderComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
    FilterContainerComponent,
    MapComponent,
  ]
})
export class SharedModule { }