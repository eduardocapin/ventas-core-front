import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  throwError,
  BehaviorSubject,
  map,
  of,
} from 'rxjs';
import { LoginRequest } from './login.request';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );

  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    email: '',
    name: '',
    lastname: '',
  });

  user: string | null = localStorage.getItem('user');
  lastname: string |null = localStorage.getItem('lastname');

  constructor(private http: HttpClient) {
    this.user = localStorage.getItem('user');
    this.lastname = localStorage.getItem('lastname');
  }

  private frontUrl= 'http://localhost:4200';

  login(credential:LoginRequest): Observable<User>{
    let schema = 'db_rechazos';
    let baseUrl = 'http://localhost';
    let port = '3000';
    return this.http
      .post<User>(`${baseUrl}:${port}/api/users/login`, {
        schema: schema,
        email: credential.email,
        password: credential.password,
      })
      .pipe(
        map((data:any) =>{
          localStorage.setItem('dir', 'db_rechazos');
          localStorage.setItem('email', credential.email);
          localStorage.setItem('baseUrl', 'http://localhost');
          localStorage.setItem('schema', 'db_rechazos');
          localStorage.setItem('port', '3000');

          this.setToken(data.token);
          localStorage.setItem('user', data.name);
          localStorage.setItem('lastname', data.lastname)
          this.user = data.name;
          this.lastname = data.lastname;
          
          return data;
        })
      );
  }

  /* Para modificar datos del usuario */
  getUserInfo(){
    let schema = localStorage.getItem('schema');
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options ={
      headers: new HttpHeaders().set(
        'Authorization', 
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .post(
        `${baseUrl}:${port}/api/users/info`,
        {
          schema: schema,
          email: localStorage.getItem('email'),
        },
        options
      )
      .pipe(
        map((data: any) =>{
          return data.fecha_insert;
        })
      );
  }
  /* encargado de mostrar errores */
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Se ha producido un error', error.error);
    } else {
      console.error(
        'Backend devolvió el código de estado ',
        error.status,
        error.error
      );
    }
    return throwError(
      () => new Error('Algo falló, por favor intentelo de nuevo')
    );
  }
  
  get userData(): Observable<User> {
    return this.currentUserData.asObservable();
  }

  get userLoginON(): Observable<Boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  // STORE the token in localstore:
  setToken(token: string) {
    // First, serialize it (but just if token is not string type).
    const tokenString: string = JSON.stringify(token);

    localStorage.setItem('token', tokenString);
  }
  // READ the token from localstorage and Deserialize
  getToken(): string | null {
    let token = localStorage.getItem('token');

    if (token != null) {
      // You just need to parse if you serialized it inside setToken() method
      token = JSON.parse(token);
    }

    return token;
  }
  deleteToken() {
    localStorage.removeItem('token');
  }
  logout() {
    this.deleteToken();
    localStorage.clear();
  }
  isAuthenticated(): Observable<boolean> {
    if (!localStorage.getItem('token')) return of(false);

    let token = localStorage.getItem('token');

    if (token) {
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);

      // Other functions
      const expirationDate = helper.getTokenExpirationDate(token);
      const isExpired = helper.isTokenExpired(token);
      return of(!isExpired);
    }

    return of(false);
  }

}
