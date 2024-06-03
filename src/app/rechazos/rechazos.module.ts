/**
    * IMPORTS MODULES
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { RechazosRoutingModule } from './rechazos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GoogleMapsModule } from '@angular/google-maps';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSliderModule } from '@angular/material/slider';

/**
    * IMPORTS COMPONENTS
*/
import { RechazosGeneralComponent } from './rechazos-general/rechazos-general.component';
import { PopupMapComponent } from './rechazos-general/popup-map-rechazos/popup-map-rechazos.component';

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
        MatSliderModule
    ]
})
export class RechazosModule{}