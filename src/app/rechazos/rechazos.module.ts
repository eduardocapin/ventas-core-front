import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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







/* paginas */
import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';
import { RechazosRoutingModule } from './rechazos-routing.module';
@NgModule({
    declarations: [
        RechazosGeneralComponent
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