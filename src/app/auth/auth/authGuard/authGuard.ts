import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanMatch,
  Route,
  UrlSegment,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
@Injectable({ providedIn: 'root' })
export class authGuard implements CanMatch, CanActivate {
  constructor(private _loginServices: LoginService, private router: Router) { }

  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): boolean | Observable<boolean> {


    return this.checkOutStatus();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {


    return this.checkOutStatus();
  }

  private checkOutStatus(): boolean | Observable<boolean> {
    return this._loginServices.isAuthenticated().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigateByUrl("/login")
        }
      })
    )
  }
}
