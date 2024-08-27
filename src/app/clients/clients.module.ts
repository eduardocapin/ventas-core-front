/**
    * IMPORT DE MODULES
*/
import { NgModule } from '@angular/core';
import { ClientRoutingModule } from './clients-routing.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule} from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GoogleMapsModule } from '@angular/google-maps';
import {MatSnackBarModule} from '@angular/material/snack-bar';
/**
    * IMPORT DE COMPONENTES
*/
import { ClientsGeneralComponent } from './clients-general/clients-general.component';
import { PopupClientDetailComponent } from './clients-general/popup-client-detail/popup-client-detail.component';
import { PopupMapClientsComponent } from './clients-general/popup-map-clients/popup-map-clients.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
    declarations:[
        ClientsGeneralComponent,
        PopupClientDetailComponent,
        PopupMapClientsComponent
    ],
    imports:[
        CommonModule,
        ClientRoutingModule,
        MatIconModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatInputModule,
        MatDialogModule,
        MatTooltipModule,
        MatButtonModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatRadioModule,
        FormsModule,
        MatSidenavModule,
        GoogleMapsModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,

    ],
    providers: [],
    bootstrap: [ClientsGeneralComponent]
})

export class ClientsModule{}