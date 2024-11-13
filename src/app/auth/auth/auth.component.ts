import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { LoginRequest } from 'src/app/services/auth/login.request';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  imagesArray: string[] = ["assets/images/login/WhyNot.png"];
  selectedImage: string = '';
  hide = true;
  errorLogin: boolean = false;
  messageError: string = '';

  loginError: string = '';
  loginForm = this.formBuilder.group({
    emailFormControl: ['', [Validators.required, Validators.email]],
    passFormControl: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private _loginServices: LoginService,
    public dialog: MatDialog,
  ) { }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  passFormControl = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.selectedImage = this.seccionarImagen();
  }

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
        (data) => {
          this.router.navigateByUrl('mobentis/dashboard/global');
          this.errorLogin = false;
          this.messageError = '';
        },
        (error) => {
          this.errorLogin = true;
          this.messageError = error.error.msg;
        }
      );
    }
  }

  seccionarImagen(): string {
    const position = Math.round(Math.random() * (this.imagesArray.length - 1));
    return this.imagesArray[position];
  }
}
