import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* paginas */
import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';
import { RechazosRoutingModule } from './rechazos-routing.module';
@NgModule({
    declarations: [
        RechazosGeneralComponent
    ],
    imports: [
        CommonModule,
        RechazosRoutingModule
    ]
})
export class RechazosModule{}