import { Component, EventEmitter, Inject, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoginService } from 'src/app/services/auth/login.service';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-profile-edit-popup',
  templateUrl: './profile-edit-popup.component.html',
  styleUrls: ['./profile-edit-popup.component.scss'],
})
export class ProfileEditPopupComponent {
  @Output() actualizarPerfil = new EventEmitter<boolean>();
  form: FormGroup;
  cargando: boolean = false;
  formChanges: boolean = false;
  email: string = '';
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  errorChangePass: boolean = false;
  messageError: string = '';

  // Formulario de Contraseña
  passForm = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmNewPassword: ['', Validators.required],
  });

  progress = 0;
  message = '';

  img: string | null = 'assets/images/user.png'; // Imagen de usuario por defecto
  imageInfos?: Observable<any>;
  imgSelected = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditPopupComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _loginServices: LoginService
  ) {
    this.form = this.fb.group({
      usuario: [''],
      cargo: [''],
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    this.loadData();
    this.cargando = false;
  }

  loadData(): void {
    this.form.patchValue({
      usuario: localStorage.getItem('user') || '',
      cargo: localStorage.getItem('cargo') || '',
    });
    this.email = localStorage.getItem('email') || '';
    this.img = localStorage.getItem('img');
  }

  cancelar(): void {
    if (this.form.dirty || this.imgSelected || this.passForm.dirty) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: `Hay cambios sin guardar, ¿deseas salir sin guardar?`,
        })
        .afterClosed()
        .subscribe((confirmado: boolean) => {
          if (confirmado) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  update(): void {
    if (this.form.dirty) {
      localStorage.setItem('user', this.form.value.usuario);
      localStorage.setItem('cargo', this.form.value.cargo);
      console.log('Actualizado:', this.form.value);
      this.form.markAsPristine();
    }
  }
  
  changePassword() {
    console.log('camibar');
    if (this.passForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword } =
        this.passForm.value;
      if (newPassword !== confirmNewPassword) {
        this.errorChangePass = true;
        this.messageError = 'La nueva contraseña no coincide.';
      } else if (newPassword === currentPassword) {
        this.errorChangePass = true;
        this.messageError =
          'La nueva contraseña no puede ser la misma que la actual.';
      } else {
        this.errorChangePass = false;
        this.messageError = '';
        this.passForm.patchValue({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
        this.passForm.markAsPristine();
        /*
        this._loginServices.changePassword(currentPassword, newPassword).subscribe(
          (data) => {
            if (data === 'Success') {
              this.passForm.reset();
              this.errorChangePass = false;
              this.messageError = '';
              this._snackBar.open('Contraseña cambiada con éxito', '', { duration: 2000 });
            }
          },
          (error) => {
            this.errorChangePass = true;
            this.messageError = error.error.msg;
          }
        );*/
      }
    }
  }

  onFormChange(): void {
    this.formChanges = this.form.dirty;
  }

  onFileSelected(selected: boolean): void {
    this.imgSelected = selected;
  }
  handleUpload(file: File): void {
    if (file) {
      this.progress = 0;
      /*
      this._loginServices.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = 'Imagen subida con éxito.';
            this.updateImg(file); // Llamamos a la función update para actualizar la imagen del usuario
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          this.message = err.error.message || 'No se ha podido subir la imagen.';

        }
      });*/
    }
  }

  updateImg(file: File): void {
    if (file) {
      /*
      this._loginServices.updateimg(file.name).subscribe(data => {
        if (data === 'Success') {
          console.log('Imagen de perfil actualizada');
        }
      });*/
    }
  }
}
