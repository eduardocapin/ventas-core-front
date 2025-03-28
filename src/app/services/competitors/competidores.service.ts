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

  constructor(private _http: HttpClient, private _loginServices: LoginService) {}

  /* llama a todos los competidores */
  getCompetidores(): Observable<ICompetidor[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<ICompetidor[]>(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/`, options)
      .pipe(
        map((data: any) => {
          console.log("COMPETIDOOOOOOREEEEEEEEES")
          console.log(data)
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
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data[0];
        })
      );
  }

  getCompetidoresPorFamilia(family_id: number): Observable<ICompetidor[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<ICompetidor[]>(`${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/family/${family_id}`, options)
      .pipe(
        map((data: any) => {
          return data;
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
      .patch(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/${competidores.id}`,
        {
          name: competidores.name,
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

  updateCompetitorsSegmentations(id:number,product_segmentation_ids:string[] ) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .patch(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/${id}`,
        {
          product_segmentation_ids: product_segmentation_ids
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

  insertCompetitor(competidores: ICompetidor, product_segmentation_ids:string[]) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/`,
        {
          nombre: competidores.name,
          product_segmentation_ids: product_segmentation_ids,
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
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/competitors/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data.status;
        })
      );
  }
}
