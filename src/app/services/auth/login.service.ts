import { Injectable } from '@angular/core';
import { LoginRequest } from './login.request';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http'
import {
  Observable,
  throwError,
  BehaviorSubject,
  map,
  of,
} from 'rxjs';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  /* almacena y emite estado actual del usaruio y si esta logeado */
  currentUserLoginOn: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(
    false
  );
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({
    id: 0,
    email: '',
  });

  private frontUrl = '';
  /* almacena los datos en el navegador de forma local */
  user: string | null = localStorage.getItem('user');
  cargo: string | null = localStorage.getItem('cargo');
  img: string | null = localStorage.getItem('img');
  /* inyecta HttpClient para realizar solicitudes HTTP */
  constructor(private http: HttpClient) { }

  /* realiza un POST  para iniciar sesion y almacenar datos en localStorage */
  previo_login(email: string): Observable<any> {
    return this.http
      .post(`${this.frontUrl}/`, {
        email: email,
      })
      .pipe(
        map((data: any) => {
          localStorage.setItem('dir', data['data'][0].dir);
          localStorage.setItem('email', data['data'][0].email);
          localStorage.setItem('baseUrl', data['data'][0].ip_publica);
          localStorage.setItem('schema', data['data'][0].nombre_schema);
          localStorage.setItem('port', data['data'][0].puerto_acceso);
          localStorage.setItem('portdb', data['data'][0].puerto_bdd);
          return data;
        })
        //,catchError(this.handleError)
      );
  }
  /* realiza solicutd POST para realizar   */
  login(credentials: LoginRequest): Observable<User> {

    let schema = localStorage.getItem('schema');
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    return this.http
      .post<User>(`${baseUrl}:${port}/`, {
        schema: schema,
        email: credentials.email,
        password: credentials.password,
      })
      .pipe(
        map((data: any) => {
          this.setToken(data.token);
          localStorage.setItem('user', data.username);
          this.user = data.username
          localStorage.setItem('img', data.img);
          this.img = data.img
          localStorage.setItem('cargo', data.cargo);
          this.cargo = data.cargo
          // Aquí puedes realizar cualquier transformación necesaria en los datos
          return data;
        })
        //catchError(this.handleError)
      );
  }

  getUserInfo() {

    let schema = localStorage.getItem('schema');
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .post(`${baseUrl}:${port}/`, {
        schema: schema,
        email: localStorage.getItem('email'),

      }, options)
      .pipe(
        map((data: any) => {

          return data.fecha_insert;
        })
        //catchError(this.handleError)
      );
  }

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
