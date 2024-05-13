import { NgModule } from '@angular/core';
import { ClientsGeneralComponent } from './clients-general/clients-general.component';
import { ClientRoutingModule } from './clients-routing.module';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
/* imports angular material */
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
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms'; // Importa FormsModule si estás utilizando formularios basados en plantillas



@NgModule({
    declarations:[
        ClientsGeneralComponent
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
        FormsModule
    ],
    providers: [],
    bootstrap: [ClientsGeneralComponent]
})

export class ClientsModule{}