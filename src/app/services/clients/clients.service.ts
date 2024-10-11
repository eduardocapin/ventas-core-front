import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IClient } from 'src/app/models/clients.model';
import { LoginService } from '../auth/login.service';
import { Contact } from 'src/app/models/clientContact.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private baseUrl = '';
  private port = '';

  constructor(private _http: HttpClient, private _loginServices: LoginService) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.port = String(localStorage.getItem('port'));
  }

  //Obtenemos la lista de clientes
  getClients(
    selectedFilters: { [key: string]: any },
    searchTerm: string,
    currentPage: number,
    itemsPerPage: number,
    sortColumn: string,
    sortDirection: string
  ): Observable<IClient[]> {
    console.log(selectedFilters)
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post<IClient[]>(
        `${this.baseUrl}:${this.port}/api/clients`,
        {
          selectedFilters,
          searchTerm,
          currentPage,
          itemsPerPage,
          sortColumn,
          sortDirection,
        },
        options
      )
      .pipe(
        map((data: any) => {
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data;
        })
      );
  }

  //Obtenemos los datos de un solo cliente
  getOneClient(id: number): Observable<IClient[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post<IClient[]>(
        `${this.baseUrl}:${this.port}/api/clients/${id}`,
        {},
        options
      )
      .pipe(
        map((data: any) => {
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data;
        })
      );
  }

  getContactClient(id: number): Observable<Contact[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/clients/contacts/:id${id}`,
        {},
        options
      )
      .pipe(
        map((data: any) => {
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data;
        })
      );
  }
}
