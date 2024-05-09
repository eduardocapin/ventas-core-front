import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGeneralComponent } from './dashboard-general/dashboard-general.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    declarations: [
        DashboardGeneralComponent
    ],
    imports: [
        CommonModule,
        DashboardRoutingModule
    ],
})

export class DahsboardModule { }