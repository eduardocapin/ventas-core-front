import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class MotivoRechazoService {

  private baseUrl = "";
  private port = "";


  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.port = String(localStorage.getItem('port'));
  
  }

  getReasons(): Observable<IMotivoRechazo[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IMotivoRechazo[]>(
        `${this.baseUrl}:${this.port}/api/motivos-rechazo`,
        options
      )
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  getReason(id: number): Observable<IMotivoRechazo> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IMotivoRechazo>(
        `${this.baseUrl}:${this.port}/api/motivos-rechazo/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          /* Aqui puedes realizar cualquier transformacion necesaria */
          return data[0];
        })
      );
  }
  updateReason(motivoRechazo: IMotivoRechazo) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/motivos-rechazo/update/${motivoRechazo.id}`,
        {
          codigo: motivoRechazo.rejection_code,
          nombre: motivoRechazo.rejection,
        },
        options
      )
      .pipe(
        map((data: any) => {
          console.log(data);
          /* Aqui puedes realizar cualquier transformacion necesaria en los datos */
          return data.status;
        })
      );
  }

  insertReason(motivoRechazo: IMotivoRechazo) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/motivos-rechazo/add`,
        {
          codigo: motivoRechazo.rejection_code,
          nombre: motivoRechazo.rejection,
        },
        options
      )
      .pipe(
        map((data: any) => {
          console.log(data)
          /* Aqui puedes realizar cualquier transformacion neesaria en los datos */
          return data.status;
        })
      );
  }
  deleteReason(id: Number) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/motivos-rechazo/delete/${id}`,
        {},
        options
      )
      .pipe(
        map((data: any) => {
          /* Aqui puedes realizar cualquier transformacion neesaria en los datos */
          return data.status;
        })
      );
  }
}
