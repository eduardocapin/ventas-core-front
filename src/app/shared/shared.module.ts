import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';
import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';
import { MenuItemComponent } from '../components/menu-item/menu-item.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,

  ],
  imports: [
    CommonModule,

  ],
  exports: [
    KPIComponent,
    DecimalesPipe,
    EnterosPipe,

  ]
})
export class SharedModule { }