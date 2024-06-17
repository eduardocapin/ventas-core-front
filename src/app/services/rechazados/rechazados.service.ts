import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from '../auth/login.service';
import { Observable, map } from 'rxjs';
import {IRechazo} from 'src/app/models/rechazos.model';
import {IEstadosRechazoCount} from'src/app/models/count.model';

@Injectable({
  providedIn: 'root'
})
export class RechazadosService {

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) { }

  getRechazos(): Observable<IRechazo[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IRechazo[]>(`${baseUrl}:${port}/api/rechazo/`, options);
  }

  countEstadosRechazos(): Observable<IEstadosRechazoCount[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<IEstadosRechazoCount[]>(`${baseUrl}:${port}/api/rechazo/count`, options);
  }

  // Nueva función para actualizar precio y símbolo de promoción
  actualizarPrecioSimboloPromocion(id_rechazo: number, pvp_es_promocion_precio: number, id_simbolo: number,) {
    let schema = localStorage.getItem('schema');
    const baseUrl = localStorage.getItem('baseUrl');
    const port = localStorage.getItem('port');
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.post(`${baseUrl}:${port}/api/rechazo/actualizarPrecioSimboloPromocion`, {
      schema: schema,
      id_rechazo: id_rechazo,
      pvp_es_promocion_precio: pvp_es_promocion_precio,
      id_simbolo: id_simbolo,
    },
  ).pipe(
    map((data: any) => {
      return data.status;
    })
  );
  }

  ////Nueva funcion para accion correctora

  actualizarAccionCorrectora(id_rechazo: number , accion_correctora:string){
    let schema = localStorage.getItem('schema');
    const baseUrl = localStorage.getItem('baseUrl');
    const port = localStorage.getItem('port');
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };

    return this._http
      .post(
        `${baseUrl}:${port}/api/rechazo/actualizarAccionCorrectora`,
        {
          schema: schema,
          id_rechazo: id_rechazo,
          accion_correctora: accion_correctora,
        }, options
      )
      .pipe(
        map((data:any) =>{
          return data.status;
        })
      );
  }
  /* actualizar estados */
  actualizarEstados(id_rechazo: number, id_estado: number){
    let schema = localStorage.getItem('schema');
    const baseUrl = localStorage.getItem('baseUrl');
    const port = localStorage.getItem('port');
    const options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${baseUrl}:${port}/api/rechazo/actualizarEstados`,
        {
          schema: schema,
          id_rechazo: id_rechazo,
          id_estado: id_estado
        },
      )
      .pipe(
        map((data:any) =>{
          return data.status;
        })
      );
  }

}
