import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {
  Observable,
  throwError,
  BehaviorSubject,
  map,
  of,
  switchMap,
} from 'rxjs';
import { LoginRequest } from './login.request';
import { User } from './user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Md5 } from 'ts-md5'
import { ConfigurationService } from 'src/app/configuration/configuration.service';
import { environment } from 'src/environments/environment';
import { AuthorizationService } from './authorization.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

 private apiUrl = environment.apiUrl;

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



  user: string | null = localStorage.getItem('user');
  cargo: string | null = localStorage.getItem('cargo');
  lastname: string | null = localStorage.getItem('lastname');


  constructor(
    private http: HttpClient,
    private authorizationService: AuthorizationService
  ) {
    this.user = localStorage.getItem('user');
    this.lastname = localStorage.getItem('lastname');
    this.cargo = localStorage.getItem('cargo');

  }




  login(credential: LoginRequest): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/api/users/login`, {
        email: credential.email,
        password: Md5.hashStr(credential.password),
      })
      .pipe(
        switchMap((data: any) => {
          console.log(data);
          this.setToken(data.token);
          localStorage.setItem('dir', 'db_rechazos');
          localStorage.setItem('email', credential.email);
          localStorage.setItem('user', data.name);
          localStorage.setItem('user_id', data.id);
          this.user = data.name;
          localStorage.setItem('cargo', data.cargo != null ? data.cargo : '');
          localStorage.setItem('lastname', data.lastname != null ? data.lastname : '');
          
          // Guardar idioma del usuario (por defecto 'es' si es null)
          const userLanguage = data.idioma || 'es';
          localStorage.setItem('userLanguage', userLanguage);

          // Cargar roles y permisos
          const token = this.getToken();
          if (token) {
            return this.authorizationService.loadAuthorizationInfo(token).pipe(
              map(() => data)
            );
          }
          
          return of(data);
        })
      );
  }

  /* Para modificar datos del usuario */
  getUserInfo() {
    let id = localStorage.getItem('user_id');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .get(
        `${this.apiUrl}/api/users/${id}`,

        options
      )
      .pipe(
        map((data: any) => {
          console.log(data)
          return data.fecha_insert;
        })
      );
  }

  resetPassword(email: string) {
    return this.http
      .post<User>(`${this.apiUrl}/api/users/reset-password`, {
        email: email,
      })
      .pipe(
        map((data: any) => {
          return data.status;
        })
      );
  }

  addNewPassword(email: string, newpass: string) {
    return this.http
      .post(`${this.apiUrl}/api/users/new-password`, {
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
    return this.http
      .post(`${this.apiUrl}/api/users/check-code`, {
        code: code,
      })
      .pipe(
        map((data: any) => {
          console.log(data)
          return data;
        })

      );
  }

  updateUserInfo(user: string, cargo: string) {
    this.user = user;
    this.cargo = cargo;
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .patch(
        `${this.apiUrl}/api/users/`,
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
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.getToken()}`
      ),
    };
    return this.http
      .patch(
        `${this.apiUrl}/api/users/`,
        {
          email: localStorage.getItem('email'),
          oldpass: Md5.hashStr(oldpass),
          newpass: Md5.hashStr(newpass),
        },
        options
      )
      .pipe(
        map((data: any) => {
          console.log(data)
          return data;
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
    this.authorizationService.clearAuthorization();
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
