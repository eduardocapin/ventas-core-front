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
import { GraficaBarraVerticalComponent } from '../components/graficas/grafica-barra-vertical/grafica-barra-vertical.component';
import { GraficaBarraHorizontalComponent } from '../components/graficas/grafica-barra-horizontal/grafica-barra-horizontal.component';
import { GraficaPastelComponent } from '../components/graficas/grafica-pastel/grafica-pastel.component';
import { GraficaSemiCirculoComponent } from '../components/graficas/grafica-semi-circulo/grafica-semi-circulo.component';
import { ClienteContactosComponent } from '../components/cliente-contactos/cliente-contactos.component';
import { ClienteDireccionesComponent } from '../components/cliente-direcciones/cliente-direcciones.component';
import { ChangeImageComponent } from '../components/change-image/change-image.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BtnExportComponent } from '../components/buttons/btn-export/btn-export.component';
import { BtnIconEditComponent } from '../components/buttons/btn-icons/btn-icon-edit/btn-icon-edit.component';
import { BtnIconDeleteComponent } from '../components/buttons/btn-icons/btn-icon-delete/btn-icon-delete.component';
import { BtnIconFileComponent } from '../components/buttons/btn-icons/btn-icon-file/btn-icon-file.component';
import { BtnIconExpandComponent } from '../components/buttons/btn-icons/btn-icon-expand/btn-icon-expand.component';
import { EtiquetaValorVerticalComponent } from '../components/etiqueta-valor-vertical/etiqueta-valor-vertical.component';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { MessageUpdateComponent } from '../components/message-update/message-update.component';
import { CorrectiveActionStatusComponent } from '../components/corrective-action-status/corrective-action-status.component';
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



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
    ClienteContactosComponent,
    ClienteDireccionesComponent,
    PopupHeaderComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
    FilterContainerComponent,
    MapComponent,
    GraficaBarraVerticalComponent,
    GraficaBarraHorizontalComponent,
    GraficaPastelComponent,
    GraficaSemiCirculoComponent,
    ChangeImageComponent,
    ConfirmDialogComponent,
    BtnIconEditComponent,
    BtnIconDeleteComponent,
    BtnIconFileComponent,
    BtnIconExpandComponent,
    BtnExportComponent,
    EtiquetaValorVerticalComponent,
    SearchInputComponent,
    MessageUpdateComponent,
    CorrectiveActionStatusComponent,
    PageTitleComponent,
  ],
  imports: [
    NgbModule,
    NgbDatepickerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgbTooltipModule, 
    MatDialogModule,
    MatProgressSpinnerModule,


  ],
  exports: [
    EtiquetaValorVerticalComponent,
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    ProgressCircleComponent,
    EtiquetaValorComponent,
    ClienteDatosGeneralesComponent,
    ClienteEconomicosComponent,
    ClienteMasInfoComponent,
    ClienteContactosComponent,
    ClienteDireccionesComponent,
    PopupHeaderComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
    FilterContainerComponent,
    MapComponent,
    GraficaBarraVerticalComponent,
    GraficaBarraHorizontalComponent,
    GraficaPastelComponent,
    GraficaSemiCirculoComponent,
    ChangeImageComponent,
    ConfirmDialogComponent,
    BtnIconEditComponent,
    BtnIconDeleteComponent,
    BtnIconFileComponent,
    BtnIconExpandComponent,
    BtnExportComponent,
    SearchInputComponent,
    MessageUpdateComponent,
    CorrectiveActionStatusComponent,
    PageTitleComponent,
  ]
})
export class SharedModule { }