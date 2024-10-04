/**
    * IMPORTS MODULES
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps';
import { RechazosRoutingModule } from './rechazos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { DecimalesPipe } from '../pipes/decimales.pipe';
import { EnterosPipe } from '../pipes/enteros.pipe';


/* angular material */
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule} from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';

/* imports de boostrap */
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

/**
    * IMPORTS COMPONENTS
*/
import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';
import { PopupMapComponent } from './rechazos-general/popup-map-rechazos/popup-map-rechazos.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
    declarations: [
        RechazosGeneralComponent,
        PopupMapComponent,
    ],
    imports: [
        CommonModule,
        RechazosRoutingModule,
        NgbTooltipModule,
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
        MatSelectModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        FormsModule,
        ReactiveFormsModule,
        MatSidenavModule,
        MatSnackBarModule,
        GoogleMapsModule,
        MatSliderModule,
        MatMenuModule,
        MatButtonToggleModule,
        SharedModule,
        NgbDropdown,
    ]
})
export class RechazosModule{}