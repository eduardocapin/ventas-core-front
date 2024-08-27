import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { LoginService } from '../../auth/login.service';
import { Contact } from 'src/app/models/clientContact.model';

@Injectable({
  providedIn: 'root',
})
export class ClientContactService {

  private baseUrl = "";
  private port = "";

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.port = String(localStorage.getItem('port'));
  }

  getContacts(id: number): Observable<Contact[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post<Contact[]>(
        `${this.baseUrl}:${this.port}/api/clientes/contactos/${id}`,
        {},
        options
      )
      .pipe(
        map((data: any) => {
          return data.data;
        })
      );
  }

  getOneContact(id: number): Observable<Contact> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post<Contact>(
        `${this.baseUrl}:${this.port}/api/clientes/contacto/${id}`,
        {},
        options
      )
      .pipe(
        map((data: any) => {
          return data.data[0];
        })
      );
  }

  sendEmail(email: string) {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .post(
        `${this.baseUrl}:${this.port}/api/email/contacto`,
        {
          destinatarios: [email]
        },
        options
      )
      .pipe(
        map((data: any) => {
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data.status;
        })
      );
  }
}