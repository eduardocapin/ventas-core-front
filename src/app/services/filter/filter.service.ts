import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../auth/login.service';
import { Observable, map } from 'rxjs';
import { IPoblacion } from 'src/app/models/poblaciones.model';
import { IProvincia } from 'src/app/models/provincias.model';
import  { IEstado } from'src/app/models/estados.model';
@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) { }

  getProvincias(): Observable<any[]> {
    let schema = localStorage.getItem('schema');
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IProvincia[]>(
        `${baseUrl}:${port}/api/filtro/provincia`,
        options
      )
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }
  getPoblaciones(): Observable<any[]> {
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IPoblacion[]>(
        `${baseUrl}:${port}/api/filtro/poblacion`,
        options
      )
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }

  getEstados(): Observable<IEstado[]> {
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IEstado[]>(`${baseUrl}:${port}/api/filtro/estados`, options)
  }

}
