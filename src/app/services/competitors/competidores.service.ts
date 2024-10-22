import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { ICompetidor } from 'src/app/models/competidor.model';
import { LoginService } from '../auth/login.service';

@Injectable({
  providedIn: 'root',
})
export class CompetidoresService {
  private baseUrl = '';
  private port = '';

  constructor(private _http: HttpClient, private _loginServices: LoginService) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.port = String(localStorage.getItem('port'));
  }

  /* llama a todos los competidores */
  getCompetidores(): Observable<ICompetidor[]> {
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<ICompetidor[]>(`${baseUrl}:${port}/api/competidores/`, options)
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  /* llamar a un competidor */
  getCompetidor(id: number): Observable<ICompetidor> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<ICompetidor>(
        `${this.baseUrl}:${this.port}/api/competidores/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data[0];
        })
      );
  }

  /* update */
  updateCompetitors(competidores: ICompetidor) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    console.log(competidores);
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/competidores/update/${competidores.id}`,
        {
          nombre: competidores.name,
          product_segmentation_id: competidores.segmentation_value_id,
        },
        options
      )
      .pipe(
        map((data: any) => {
          console.log(data);
          return data.status;
        })
      );
  }

  insertCompetitor(competidores: ICompetidor) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/competidores/add`,
        {
          nombre: competidores.name,
          product_segmentation_id: competidores.segmentation_value_id,
        },
        options
      )
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }
  deleteCompetitor(id: Number) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .delete(
        `${this.baseUrl}:${this.port}/api/competidores/delete/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data.status;
        })
      );
  }
}
