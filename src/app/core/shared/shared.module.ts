import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressCircleComponent } from '../components/progress-circle/progress-circle.component';
import { EtiquetaValorComponent } from '../components/etiqueta-valor/etiqueta-valor.component';
import { PopupHeaderComponent } from '../components/popup-header/popup-header.component';
import { DateFilterComponent } from '../components/filters/date-filter/date-filter.component';
import { SearchFilterComponent } from '../components/filters/search-filter/search-filter.component';
import { MultiSelectFilterComponent } from '../components/filters/multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from '../components/filters/range-filter/range-filter.component';
import { FilterContainerComponent } from '../components/filters/filter-container/filter-container.component';
import { MapComponent } from '../components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbModule, NgbTooltipModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { GraficaBarraVerticalComponent } from '../components/graficas/grafica-barra-vertical/grafica-barra-vertical.component';
import { GraficaBarraHorizontalComponent } from '../components/graficas/grafica-barra-horizontal/grafica-barra-horizontal.component';
import { GraficaPastelComponent } from '../components/graficas/grafica-pastel/grafica-pastel.component';
import { GraficaSemiCirculoComponent } from '../components/graficas/grafica-semi-circulo/grafica-semi-circulo.component';
import { ChangeImageComponent } from '../components/change-image/change-image.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BtnExportComponent } from '../components/buttons/btn-export/btn-export.component';
import { BtnIconEditComponent } from '../components/buttons/btn-icons/btn-icon-edit/btn-icon-edit.component';
import { BtnIconDeleteComponent } from '../components/buttons/btn-icons/btn-icon-delete/btn-icon-delete.component';
import { BtnIconFileComponent } from '../components/buttons/btn-icons/btn-icon-file/btn-icon-file.component';
import { BtnIconCopyComponent } from '../components/buttons/btn-icons/btn-icon-copy/btn-icon-copy.component';
import { BtnIconExpandComponent } from '../components/buttons/btn-icons/btn-icon-expand/btn-icon-expand.component';
import { TableComponent } from '../components/table/table.component';
import { EtiquetaValorVerticalComponent } from '../components/etiqueta-valor-vertical/etiqueta-valor-vertical.component';
import { SearchInputComponent } from '../components/search-input/search-input.component';
import { MessageUpdateComponent } from '../components/message-update/message-update.component';
import { PageTitleComponent } from '../components/page-title/page-title.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmpresaDropdownComponent } from '../components/empresa-dropdown/empresa-dropdown.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { LicenseBadgeComponent } from '../components/license-badge/license-badge.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { BigIntPipe } from '../pipes/big-int.pipe';
import { TranslatePipe } from '../pipes/translate.pipe';
import { ListItemComponent } from '../components/list-item/list-item.component';
import { RouterModule } from '@angular/router';
import { ConfigurationListItemContainerComponent } from '../components/configuration-list-item-container/configuration-list-item-container.component';



@NgModule({
  declarations: [
    DecimalesPipe,
    EnterosPipe,
    BigIntPipe,
    PaginationComponent,
    ProgressCircleComponent,
    EtiquetaValorComponent,
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
    BtnIconCopyComponent,
    BtnIconExpandComponent,
    TableComponent,
    BtnExportComponent,
    EtiquetaValorVerticalComponent,
    SearchInputComponent,
    MessageUpdateComponent,
    PageTitleComponent,
    EmpresaDropdownComponent,
    HasRoleDirective,
    HasPermissionDirective,
    LicenseBadgeComponent,
    TranslatePipe,
    MenuItemComponent,
    ListItemComponent, 
    ConfigurationListItemContainerComponent
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
    RouterModule,


  ],
  exports: [
    EtiquetaValorVerticalComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    ProgressCircleComponent,
    EtiquetaValorComponent,
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
    BtnIconCopyComponent,
    BtnIconExpandComponent,
    TableComponent,
    BtnExportComponent,
    SearchInputComponent,
    MessageUpdateComponent,
    PageTitleComponent,
    EmpresaDropdownComponent,
    HasRoleDirective,
    HasPermissionDirective,
    LicenseBadgeComponent,
    TranslatePipe,
    MenuItemComponent,
    ListItemComponent,
    ConfigurationListItemContainerComponent
  ]
})
export class SharedModule { }