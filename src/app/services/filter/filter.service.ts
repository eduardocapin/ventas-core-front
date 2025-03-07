import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../auth/login.service';
import { Observable, map, of } from 'rxjs';
import { IPoblacion } from 'src/app/models/poblaciones.model';
import { IProvincia } from 'src/app/models/provincias.model';
import { IEstado } from 'src/app/models/estados.model';
import { ISimbolo } from 'src/app/models/simbolos.model';
import { ICompetidor } from 'src/app/models/competidor.model';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { IFamilia } from 'src/app/models/familia.mode';
import { ISubFamilia } from 'src/app/models/subFamilia.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {


  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
  }

  getFiltersForComponent(componentId: string | undefined): Observable<any> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/${componentId}`, options)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  getSavedFilters(componentId: string): Observable<any> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
    .get(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/saved/${componentId}`, options)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  saveFilter(componentId:string, nombre: string, filtros: any[]): Observable<any> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    console.log(filtros)
    console.log(typeof(filtros))
    return this._http.post<any>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/saved/${componentId}`,
      { nombre, filtros },
      options
    );
  }

  deleteFilter(id: number) {

    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.delete<any>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/saved/${id}`,
      options
    );
  }

  getFilterOptions(endpoint: string): Observable<any[]> {

    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/${endpoint}`, options)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

  getProvincias(): Observable<IProvincia[]> {

    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IProvincia[]>(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/provinces`, options)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  getPoblaciones(): Observable<IPoblacion[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IPoblacion[]>(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/cities`, options)
      
  }

  getEstados(): Observable<IEstado[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IEstado[]>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/status`,
      options
    ).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  /* eliminar esta funcion porque se repite en competidores.service.ts */
  getCompetidores(): Observable<ICompetidor[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ICompetidor[]>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/competitors`,
      options
    );
  }

  getSimbolos(): Observable<ISimbolo[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ISimbolo[]>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/symbol`,
      options
    ).pipe(
      map((data: any) => {
        console.log(data)
        return data;
      })
    );
  }

  getMotivosRechazo(): Observable<IMotivoRechazo[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IMotivoRechazo[]>(
      `${this._loginServices.baseUrl}:${this._loginServices.port}/api/filters/reasons-rejection`,
      options
    ).pipe(
      map((data: any) => {
        console.log(data)
        return data;
      })
    );
  }



  
}
