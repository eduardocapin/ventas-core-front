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
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilterService {

  private apiUrl = environment.apiUrl;
  
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
      .get(`${this.apiUrl}/api/filters/${componentId}`, options)
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
    .get(`${this.apiUrl}/api/filters/saved/${componentId}`, options)
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
      `${this.apiUrl}/api/filters/saved/${componentId}`,
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
      `${this.apiUrl}/api/filters/saved/${id}`,
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
      .get(`${this.apiUrl}/api/filters/${endpoint}`, options)
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
      .get<IProvincia[]>(`${this.apiUrl}/api/filters/provinces`, options)
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
      .get<IPoblacion[]>(`${this.apiUrl}/api/filters/cities`, options)
      
  }

  getEstados(): Observable<IEstado[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IEstado[]>(
      `${this.apiUrl}/api/filters/status`,
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
      `${this.apiUrl}/api/filters/competitors`,
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
      `${this.apiUrl}/api/filters/symbol`,
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
      `${this.apiUrl}/api/filters/reasons-rejection`,
      options
    ).pipe(
      map((data: any) => {
        console.log(data)
        return data;
      })
    );
  }



  
}
