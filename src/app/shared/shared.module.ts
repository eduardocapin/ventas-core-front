import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { AppRoutingModule } from '../app-routing.module';
import { PaginationComponent } from '../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,
    PaginationComponent,
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
  ]
})
export class SharedModule { }