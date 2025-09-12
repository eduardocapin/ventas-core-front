import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginService } from '../auth/login.service';
import { ImportTableName } from 'src/app/models/importTableName.model';
import { ImportTableField } from 'src/app/models/importTableField.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImportExcelService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {}

  /* service para llamar a todos los datos de ImportTableName */
  getTablesName(): Observable<ImportTableName[]>{
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    console.log(this._loginServices.getToken());
    return this._http
      .get<ImportTableName[]>(`${this.apiUrl}/api/import/`, options)
      .pipe(
        map((data: any) =>{
          return data;
        })
      );
  }
  
  /* service para llamar a todos los datos de ImportTableField (osea los campos) */
  getImportTableField(id:number): Observable<ImportTableField[]>{
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<ImportTableField[]>(`${this.apiUrl}/api/import/field/${id}`, options)
      .pipe(
        map((data) =>{
          return data;
        })
      );
  }

  /* funcion para importar excel (update) */
  importExcel(tableName: string, data: any[]): Observable<any>{
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };

    return this._http
      .post(
        `${this.apiUrl}/api/importar/import`,
        { tableName, data },
        options
      )
      .pipe(
        map((response: any) => {
          console.log('Respuesta del servidor:', response);
          return response;
        })
      );

  }
}
