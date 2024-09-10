import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../auth/login.service';
import { Observable, map } from 'rxjs';
import { IPoblacion } from 'src/app/models/poblaciones.model';
import { IProvincia } from 'src/app/models/provincias.model';
import  { IEstado } from'src/app/models/estados.model';
import { ISimbolo } from 'src/app/models/simbolos.model';
import { IRechazo } from 'src/app/models/rechazos.model';
import { ICompetidor } from 'src/app/models/competidor.model';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
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
        `${baseUrl}:${port}/api/filtro/provincias`,
        options
      )
      .pipe(
        map((data: any) => {
          return data;
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
        `${baseUrl}:${port}/api/filtro/poblaciones`,
        options
      )
      .pipe(
        map((data: any) => {
          return data;
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

  getCompetidores(): Observable<ICompetidor[]> {
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ICompetidor[]>(`${baseUrl}:${port}/api/filtro/competidores`, options)
  }

  getSimbolos(): Observable<ISimbolo[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ISimbolo[]>(`${baseUrl}:${port}/api/filtro/simbolos`, options)
  }

  getMotivosRechazo(): Observable<IMotivoRechazo[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IMotivoRechazo[]>(`${baseUrl}:${port}/api/filtro/motivos-rechazo`, options)
  }
    
}
