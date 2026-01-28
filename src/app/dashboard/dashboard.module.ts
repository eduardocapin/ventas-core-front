import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGeneralComponent } from './dashboard-general/dashboard-general.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '../core/shared/shared.module';

@NgModule({
  declarations: [
    DashboardGeneralComponent,
  ],
  imports: [
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatTooltipModule,
    SharedModule,
    MatDialogModule,
  ],
  providers: [

  ],
})
export class DahsboardModule { }
