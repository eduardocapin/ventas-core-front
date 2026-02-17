import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { DocumentsImportRoutingModule } from './documents-import-routing.module';
import { ImportadorDocumentosGeneralComponent } from './importador-documentos-general/importador-documentos-general.component';
import { VisorDocumentoVentaDialogComponent } from './visor-documento-venta-dialog/visor-documento-venta-dialog.component';
import { SharedModule } from '../core/shared/shared.module';

@NgModule({
  declarations: [
    ImportadorDocumentosGeneralComponent,
    VisorDocumentoVentaDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DocumentsImportRoutingModule,
    SharedModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
  ],
})
export class DocumentsImportModule {}
