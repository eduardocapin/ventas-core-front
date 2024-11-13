import { Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/services/auth/login.service';

@Injectable({providedIn: 'root'})
export class codeGuard implements CanMatch {
    constructor(
        private _loginServices: LoginService,
        private router: Router,
    ){}
    
    canMatch(
        route: Route,
        segments: UrlSegment[]
      ): boolean | Observable<boolean | UrlTree> {
        if (segments.length > 1) {
          return this.checkOutStatus(segments[1].path);
        }
        return of(this.router.parseUrl('/reset-password'))
      }

    private checkOutStatus(code: any): Observable<boolean | UrlTree> {
        return this._loginServices.checkCode(code).pipe(
          map((data: boolean) => {
            if (!data) {
              return this.router.parseUrl('/reset-password');
            } else {
              return true;
            }
          }),
          catchError(() => {
            return of(this.router.parseUrl('/reset-password'));
          })
        );
    }
}