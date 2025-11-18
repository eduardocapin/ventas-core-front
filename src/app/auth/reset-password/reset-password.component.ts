import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { LoginService } from 'src/app/services/auth/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'mobentis-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  hide = true;
  mensajeEnviado: boolean = false;

  changePassForm = this.formBuilder.group({
    emailFormControl: ['', Validators.required, , Validators.email],
  });
  constructor(
    private formBuilder: FormBuilder,
    private _loginServices: LoginService,
    private router: Router,
  ) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  changePassword() {
    let email = '';

    if(this.emailFormControl.value){
      if (this.emailFormControl.value) {
        email = this.emailFormControl.value;
      }
      if (this.emailFormControl.status === 'VALID') {
        this._loginServices.resetPassword(email).subscribe(
          (data) => {
            if (data === 'Success') {
              this.changePassForm.reset;
            }
          },
          (error) => {
            console.error('Error al asignar el dataSource:', error);
          }
        );
        this.mensajeEnviado = true;
      }
    }
  }
  cancelar() {
    this.router.navigateByUrl('login');
  }

}
