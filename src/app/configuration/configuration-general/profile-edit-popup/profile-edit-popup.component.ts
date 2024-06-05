import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile-edit-popup',
  templateUrl: './profile-edit-popup.component.html',
  styleUrls: ['./profile-edit-popup.component.css']
})
export class ProfileEditPopupComponent {

  constructor(
    public dialogRef: MatDialogRef<ProfileEditPopupComponent>,
    private snackBar: MatSnackBar
  ) { }

  guardar(): void {
    // Lógica para guardar los cambios del perfil

    this.snackBar.open('El PERFIL se ha actualizado correctamente', '', {
      duration: 3000,
      verticalPosition: 'top',
    });
    this.dialogRef.close();
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
