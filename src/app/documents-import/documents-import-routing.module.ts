import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ImportadorDocumentosGeneralComponent } from './importador-documentos-general/importador-documentos-general.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'global' },
  { path: 'global', component: ImportadorDocumentosGeneralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsImportRoutingModule {}
