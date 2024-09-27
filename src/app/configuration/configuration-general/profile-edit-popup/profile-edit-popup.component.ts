import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UpdatePhotoComponent } from './../update-photo/update-photo.component';
import { ChangePasswordComponent } from './../change-password/change-password.component';

@Component({
  selector: 'app-profile-edit-popup',
  templateUrl: './profile-edit-popup.component.html',
  styleUrls: ['./profile-edit-popup.component.scss']
})
export class ProfileEditPopupComponent {

  @Output() actualizarPerfil = new EventEmitter<boolean>();
  img: string | null = '';
  form: FormGroup;
  fecha_insert?: string;
  cargando: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditPopupComponent>,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      email: [''],
      usuario: [''],
      cargo: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.cargando = true;

    // Leer datos desde localStorage
    this.form.patchValue({
      email: localStorage.getItem('email') || '',
      usuario: localStorage.getItem('user') || '',
      cargo: localStorage.getItem('cargo') || '',
      password: '',
    });

    this.img = localStorage.getItem('img');
    this.fecha_insert = localStorage.getItem('fecha_insert') || '12/08/24'; // Ajusta si necesitas otro dato local
    this.cargando = false;
  }

  cancelar() {
    this.dialogRef.close();
  }

  update() {
    // Actualizar datos en localStorage
    localStorage.setItem('user', this.form.value.usuario);
    localStorage.setItem('cargo', this.form.value.cargo);
    localStorage.setItem('email', this.form.value.email);
    localStorage.setItem('password', this.form.value.password);

    // Lógica de actualización adicional si es necesaria
    // Por ejemplo, si necesitas hacer una llamada a un servicio para actualizar en el servidor

    console.log('Actualizado:', this.form.value);
    this.dialogRef.close();
  }

  editarImg() {
    const dialogRef = this.dialog.open(UpdatePhotoComponent, {
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
      this.img = localStorage.getItem('img');
    });
  }

  changePassword() {
    const dialogRef = this.dialog.open(ChangePasswordComponent, {
      disableClose: true,
      width: "40%",
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Password change dialog closed');
    });
  }
}
