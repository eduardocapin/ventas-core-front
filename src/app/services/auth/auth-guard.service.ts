import { Injectable } from "@angular/core";
import { Router, CanActivate} from "@angular/router";

import { LoginService } from "./login.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public _auth: LoginService, public router: Router) { }
    canActivate(): boolean {
        if(!this._auth.isAuthenticated()){
            this.router.navigate(['\login']);
            return false;
        }
        return true;
    }
}