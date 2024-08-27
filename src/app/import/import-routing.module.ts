import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExcelImportComponent } from './excel-import/excel-import.component';



const routes: Routes = [
  { path: "global", 
    component: ExcelImportComponent,
   },
  { path: "global/:tabla", component: ExcelImportComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class ImportRoutingModule { }
