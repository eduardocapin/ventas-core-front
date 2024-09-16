import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from '../auth/login.service';
import { Observable } from 'rxjs';
import { MenuItem }  from 'src/app/models/menuItem.model';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private baseUrl = "";
  private puerto_integracion = "";

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.puerto_integracion = String(localStorage.getItem('puerto_integracion'));
  }


  getMenuItems(id:number, language:string): Observable<MenuItem[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<MenuItem[]>(`${baseUrl}:${port}/api/menu/${id}/${language}`, options)
  }
}
