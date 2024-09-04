import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPIComponent } from '../components/kpi/kpi.component';

@NgModule({
  declarations: [KPIComponent],
  imports: [
    CommonModule
  ],
  exports: [KPIComponent] 
})
export class SharedModule { }