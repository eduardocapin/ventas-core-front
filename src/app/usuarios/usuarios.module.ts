import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosGlobalComponent } from './usuarios-global/usuarios-global.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    UsuariosGlobalComponent,
    CreateUserDialogComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    FormsModule,
    SharedModule,
    MatDialogModule
  ]
})
export class UsuariosModule { }
