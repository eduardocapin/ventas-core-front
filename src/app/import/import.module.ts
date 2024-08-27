import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportRoutingModule } from './import-routing.module';
import { ExcelImportComponent } from './excel-import/excel-import.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    ExcelImportComponent,
  ],
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    CommonModule,
    ImportRoutingModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule
  ]
})
export class ImportModule { }
