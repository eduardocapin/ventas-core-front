import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentsImportRoutingModule } from './documents-import-routing.module';
import { ImportadorDocumentosGeneralComponent } from './importador-documentos-general/importador-documentos-general.component';
import { SharedModule } from '../core/shared/shared.module';

@NgModule({
  declarations: [ImportadorDocumentosGeneralComponent],
  imports: [
    CommonModule,
    FormsModule,
    DocumentsImportRoutingModule,
    SharedModule,
  ],
})
export class DocumentsImportModule {}
