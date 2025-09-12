import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from '../auth/login.service';
import { Observable } from 'rxjs';
import { MenuItem }  from 'src/app/models/menuItem.model';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) { }


  getMenuItems(id:number, language:string): Observable<MenuItem[]>{
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<MenuItem[]>(`${this.apiUrl}/api/menus/${id}/${language}`, options)
  }
}
