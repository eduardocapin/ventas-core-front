import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';

const routes: Routes = [
    {path: "/", component: RechazosGeneralComponent},
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,  
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class RechazosRoutingModule{}