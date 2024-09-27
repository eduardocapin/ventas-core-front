import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/services/auth/login.request';
import { LoginService } from 'src/app/services/auth/login.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  errorChangePass: boolean = false;
  messageError: string = '';


  changePassForm = this.formBuilder.group({
    passFormControl: ['', Validators.required],
    newPassFormControl: ['', Validators.required],
    newPassFormControl2: ['', Validators.required],
  });
  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private formBuilder: FormBuilder,
    private _loginServices: LoginService,
    private _snackBar: MatSnackBar
  ) {}

  passFormControl = new FormControl('', [Validators.required]);
  newPassFormControl = new FormControl('', [Validators.required]);
  newPassFormControl2 = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  changePassword() {
    /* let oldpass = ''
    let newpass = ''
    if (this.passFormControl.value) {
      oldpass = this.passFormControl.value;
    }
    if (this.newPassFormControl.value) {
      newpass = this.newPassFormControl.value;
    }
    if (
      this.passFormControl.status === 'VALID' &&
      this.newPassFormControl.status === 'VALID' &&
      this.newPassFormControl2.status === 'VALID'
    ) {
      if(this.newPassFormControl.value != this.newPassFormControl2.value){
        this.errorChangePass = true
        this.messageError = 'La nueva contraseña no coincide.'
      }else if(this.newPassFormControl.value === this.passFormControl.value){
        this.errorChangePass = true
        this.messageError = 'La nueva contraseña no puede ser la misma que la actual.'
      }else{
        this._loginServices.changePassword(oldpass,newpass).subscribe(
          (data) => {
            if (data === 'Success') {
              this.changePassForm.reset;
              this.errorChangePass = false;
              this.messageError = '';
              this._snackBar.open('Contraseña cambiada con exito', '', {
                duration: 2000,
              });
              this.dialogRef.close();
            }
          },
          (error) => {
            this.errorChangePass = true;
            this.messageError = error.error.msg;
            console.log(error.error.msg);
            console.error('Error al asignar el dataSource:', error);
          }
        );
      }
    } */
  }

  cancelar() {
    this.dialogRef.close();
  }
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
