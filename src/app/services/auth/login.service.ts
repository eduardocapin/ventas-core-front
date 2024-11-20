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
import { Md5 } from 'ts-md5'
import { ConfigurationService } from 'src/app/configuration/configuration.service';

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
    cargo: '',
  });

  private baseUrl = "";
  private port = "";
  private puerto_archivos = "";


  user: string | null = localStorage.getItem('user');
  cargo: string | null = localStorage.getItem('position_company');
  lastname: string | null = localStorage.getItem('lastname');


  constructor(
    private http: HttpClient,
    private configurationService: ConfigurationService,
  ) {
    this.user = localStorage.getItem('user');
    this.lastname = localStorage.getItem('lastname');
    this.cargo = localStorage.getItem('position_company');
    this.inicializar();
  }


  /* funcion de inicializacion */
  async inicializar() {
    await this.configurationService.loadConfig();
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.port = String(localStorage.getItem('port'));
    this.puerto_archivos = String(localStorage.getItem('puerto_archivos'));
  }

  login(credential: LoginRequest): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}:${this.port}/api/users/login`, {
        email: credential.email,
        password: Md5.hashStr(credential.password),
      })
      .pipe(
        map((data: any) => {
          localStorage.setItem('dir', 'db_rechazos');
          localStorage.setItem('email', credential.email);
          this.setToken(data.token);
          localStorage.setItem('user', data.name);
          localStorage.setItem('lastname', data.lastname)
          localStorage.setItem('cargo', data.cargo)
          this.user = data.name;
          this.lastname = data.lastname;
          this.cargo = data.cargo;
          return data;
        })
      );
  }

  /* Para modificar datos del usuario */
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
      .post(
        `${baseUrl}:${port}/api/users/info`,
        {
          schema: schema,
          email: localStorage.getItem('email'),
        },
        options
      )
      .pipe(
        map((data: any) => {
          return data.fecha_insert;
        })
      );
  }

  resetPassword(email: string) {
    return this.http
      .post<User>(`${this.baseUrl}:${this.port}/api/users/reset-password`, {
        email: email,
      })
      .pipe(
        map((data: any) => {
          return data.status;
        })
      );
  }

  addNewPassword(email: string, newpass: string) {
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    return this.http
      .post(`${baseUrl}:${port}/api/users/new-password`, {
        email: email,
        newpass: Md5.hashStr(newpass),
      })
      .pipe(
        map((data: any) => {
          return data.status;
        })
      );
  }

  checkCode(code: string) {
    let ip = String(localStorage.getItem('baseUrl'))
    let puerto = String(localStorage.getItem('port'))
    return this.http
      .post(`${ip}:${puerto}/api/users/check-code`, {
        code: code,
      })
      .pipe(
        map((data: any) => {
          return data[0];
        })

      );
  }

  updateUserInfo(user: string, cargo: string) {
    this.user = user;
    this.cargo = cargo;
    let ip = String(localStorage.getItem('baseUrl'))
    let puerto = String(localStorage.getItem('port'))
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .post(
        `${ip}:${puerto}/api/users/update`,
        {
          email: localStorage.getItem('email'),
          user: user,
          cargo: cargo,
        },
        options
      )
      .pipe(
        map((data: any) => {
          return data.status;
        })
        //catchError(this.handleError)
      );
  }

  changePassword(oldpass: string, newpass: string) {

    let ip = String(localStorage.getItem('baseUrl'))
    let puerto = String(localStorage.getItem('port'))
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .post(
        `${ip}:${puerto}/api/users/change-password`,
        {
          email: localStorage.getItem('email'),
          oldpass: Md5.hashStr(oldpass),
          newpass: Md5.hashStr(newpass),
        },
        options
      )
      .pipe(
        map((data: any) => {
          return data.status;
        })
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
