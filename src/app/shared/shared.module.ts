import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { AppRoutingModule } from '../app-routing.module';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateFilterComponent } from '../components/filters/date-filter/date-filter.component';
import { SearchFilterComponent } from '../components/filters/search-filter/search-filter.component';
import { MultiSelectFilterComponent } from '../components/filters/multi-select-filter/multi-select-filter.component';
import { RangeFilterComponent } from '../components/filters/range-filter/range-filter.component';

@NgModule({
  declarations: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule  

  ],
  exports: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
    DateFilterComponent,
    SearchFilterComponent,
    MultiSelectFilterComponent,
    RangeFilterComponent,
  ]
})
export class SharedModule { }