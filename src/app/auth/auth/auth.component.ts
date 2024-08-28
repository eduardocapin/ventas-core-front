import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/login.request';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  hide = true;
  errorLogin: boolean = false;
  messageError: string = '';
  
  loginError: string = '';
  loginForm = this.formBuilder.group({
    emailFormControl: ['', [Validators.required, Validators.email]], //validador de email
    passFormControl: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _loginServices: LoginService,
    public dialog: MatDialog,
  ) {}

  //!!! añadir: Validators.pattern('.+@[a-zA-Z0-9]+\.[a-zA-Z]{2,10}')
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);// Validators.email
  passFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  login() {
    let login: LoginRequest = {
      email: '',
      password: '',
    };
    if (this.emailFormControl.value) {
      login.email = this.emailFormControl.value;
    }
    if (this.passFormControl.value) {
      login.password = this.passFormControl.value;
    }
    if (this.emailFormControl.status === 'VALID' && this.passFormControl.status === 'VALID') {
      this._loginServices.login(login).subscribe(
        (data) =>{
          console.log(data);
          this.router.navigateByUrl('mobentis/dashboard/global');
          this.loginForm.reset;
          this.errorLogin = false;
          this.messageError = '';
        },
        (error) =>{
          this.errorLogin= true;
          this.messageError = error.error.msg;
          console.log(error.error.msg);
          console.error("Error al asignar dataSource: ", error);
        }
      );
    }
  }

}

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
