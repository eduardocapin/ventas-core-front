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

  constructor(private _http: HttpClient, private _loginServices: LoginService) { }

  //Obtenemos la lista de clientes
  getClients(
    selectedFilters: { [key: string]: any },
    searchTerm: string,
    currentPage: number,
    itemsPerPage: number,
    sortColumn: string,
    sortDirection: string
  ): Observable<IClient[]> {
    console.log("Filtros seleccionados:", selectedFilters);
  
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
  
    // Construcción del body sin valores vacíos
    let requestBody: any = {
      searchTerm,
      currentPage,
      itemsPerPage,
      sortColumn,
      sortDirection,
      ...(Object.keys(selectedFilters).length > 0 && { selectedFilters })
    };
  
    
  
    console.log("Body enviado:", requestBody);
  
    return this._http
      .post<IClient[]>(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/clients/list`,
        requestBody, 
        options
      )
      .pipe(
        map((data: any) => {
          console.log("Respuesta recibida:", data);
          return data;
        })
      );
  }
  //Obtenemos los datos de un solo cliente
  getOneClient(id: number): Observable<IClient> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<IClient[]>(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/clients/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          console.log(data)
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
      .get(
        `${this._loginServices.baseUrl}:${this._loginServices.port}/api/clients/contacts/${id}`,
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
