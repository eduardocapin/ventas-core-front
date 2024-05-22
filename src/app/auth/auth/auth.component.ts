import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  hide = true;
  errorLogin: boolean=false;
  messageError: string ='';

  loginError: string= "";
  loginForm = this.formBuilder.group({
    emailFormControl: ["", [Validators.required]],
    passFormControl: ["", [Validators.required]]
  })
  constructor(private formBuilder:FormBuilder, private router: Router){}

  emailFormControl = new FormControl('', [Validators.required,]);
  passFormControl = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();

  login(){

  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
