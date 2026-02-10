import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
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
  ],
})
export class DocumentsImportModule {}
