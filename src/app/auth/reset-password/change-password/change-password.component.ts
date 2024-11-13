import { Component } from '@angular/core';
import { LoginService } from 'src/app/services/auth/login.service';
import { FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { timeout } from 'rxjs';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  code: string = '';
  email:string = '';

  hide = true;
  hide2 = true;
  errorChangePass: boolean = false;
  messageError: string = '';

  changePassForm = this.formBuilder.group({
    emailFormControl: [''],
    newPassFormControl: ['', Validators.required],
    newPassFormControl2: ['', Validators.required],
  });

  constructor(
    private _loginServices: LoginService, 
    private formBuilder: FormBuilder, 
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private _notifactionService: NotificationService,
  ) {
    this.code = this.rutaActiva.snapshot.params['code']
  }

  ngOnInit(): void {
    this._loginServices
      .checkCode(this.code)
      .subscribe((data) => {
        if (data) {
          this.email = data.email
          this.emailFormControl.patchValue(data.email,
          );
        }
      });
  }
  emailFormControl = new FormControl('');
  newPassFormControl = new FormControl('', [Validators.required]);
  newPassFormControl2 = new FormControl('', [Validators.required]);
  changePassword() {
    let newpass = ''

    if (this.newPassFormControl.value) {
      newpass = this.newPassFormControl.value;
    }
    if (

      this.newPassFormControl.status === 'VALID' &&
      this.newPassFormControl2.status === 'VALID'
    ) {
      if (this.newPassFormControl.value != this.newPassFormControl2.value) {
        this.errorChangePass = true
        this.messageError = 'La nueva contraseña no coincide.'
      } else {
        this._loginServices.addNewPassword(this.email, newpass).subscribe(
          (data) => {
            if (data === 'Success') {
              this.changePassForm.reset;
              this.errorChangePass = false;
              this.messageError = '';
              this._notifactionService.showSuccess('Contraseña cambiada con exito');
              this.router.navigateByUrl('login');
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
    }
  }

  cancelar() {
    this.router.navigateByUrl('login');
  }
}
