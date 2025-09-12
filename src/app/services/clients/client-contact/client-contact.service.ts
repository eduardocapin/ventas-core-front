import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from '../../auth/login.service';
import { Contact } from 'src/app/models/clientContact.model';

@Injectable({
  providedIn: 'root',
})
export class ClientContactService {
  private apiUrl = environment.apiUrl;
  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService
  ) {
  }

  getContacts(id: number): Observable<Contact[]> {
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http
      .get<Contact[]>(
        `${this.apiUrl}/api/clients/contacts/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data;
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
      .get<Contact>(
        `${this.apiUrl}/api/clients/contact/${id}`,
        options
      )
      .pipe(
        map((data: any) => {
          return data;
        })
      );
  }

}