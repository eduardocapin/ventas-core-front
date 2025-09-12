import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { LoginService } from '../auth/login.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MotivoRechazoService {

  private apiUrl = environment.apiUrl;
  
  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {}

  getReasons(): Observable<IMotivoRechazo[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IMotivoRechazo[]>(
        `${this.apiUrl}/api/reasons-rejection`,
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
        `${this.apiUrl}/api/reasons-rejection/${id}`,
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
      .patch(
        `${this.apiUrl}/api/reasons-rejection/${motivoRechazo.id}`,
        {
          codigo: motivoRechazo.rejection_code,
          nombre: motivoRechazo.name,
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
        `${this.apiUrl}/api/reasons-rejection/`,
        {
          codigo: motivoRechazo.rejection_code,
          nombre: motivoRechazo.name,
        },
        options
      )
      .pipe(
        map((data: any) => {
          return data;
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
      .delete(
        `${this.apiUrl}/api/reasons-rejection/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          /* Aqui puedes realizar cualquier transformacion neesaria en los datos */
          return data;
        })
      );
  }
}
