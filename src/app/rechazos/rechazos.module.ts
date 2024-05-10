import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/* imports angular material */
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { RechazosRoutingModule } from './rechazos-routing.module';

/* paginas */
import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';
import { PopupMapComponent } from './rechazos-general/popup-map/popup-map.component';
@NgModule({
    declarations: [
        RechazosGeneralComponent,
        PopupMapComponent,
    ],
    imports: [
        CommonModule,
        RechazosRoutingModule,
        MatTableModule,
        MatCheckboxModule,
        MatSortModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        MatTooltipModule,
        MatSelectModule
    ]
})
export class RechazosModule{}