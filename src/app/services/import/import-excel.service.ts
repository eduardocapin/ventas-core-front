import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root'
})
export class ImportExcelService {

  private baseUrl = "";
  private puerto_integracion = "";

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.puerto_integracion = String(localStorage.getItem('puerto_integracion'));
  }


  importExcel(recarga: any) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    /*
    return this._http
      .post(
        `${this.baseUrl}:${this.puerto_integracion}/api/input`,
        recarga,
        options
      )
      .pipe(
        map((data: any) => {
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data.status;
        })
      );
      */
  }
}
