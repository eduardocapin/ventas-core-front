import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from '../auth/login.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from 'src/app/configuration/configuration-general/profile-edit-popup/profile-edit-popup.component';
import { ReasonsRejectionsComponent } from 'src/app/configuration/configuration-general/reasons-rejections/reasons-rejections.component';
import { ConfigurationContainer } from 'src/app/models/configurationContainer.model';

@Injectable({
  providedIn: 'root'
})
export class ListItemService {

  private baseUrl = "";
  private puerto_integracion = "";

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService,
    public dialog: MatDialog
  ) {
    this.baseUrl = String(localStorage.getItem('baseUrl'));
    this.puerto_integracion = String(localStorage.getItem('puerto_integracion'));
  }

  private functionRegistry: { [key: string]: () => void } = {
    openProfileEditPopup: () => {
      const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
        width: 'auto',
        disableClose: true
      });
    },
    openReasonsRejections: () => {
      const dialogRef = this.dialog.open(ReasonsRejectionsComponent, {
        width: 'auto',
        disableClose: true
      });
    },
    openCompetitor: () =>{
      const dialogRef = this.dialog
    }
    
  };

  executeFunction(functionName: string) {
    if (this.functionRegistry[functionName]) {
      this.functionRegistry[functionName]();
    } else {
      console.error(`Function ${functionName} not found`);
    }
  }
  getConfigContainers(): Observable<ConfigurationContainer[]>{
    let baseUrl = localStorage.getItem('baseUrl');
    let port = localStorage.getItem('port');
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ConfigurationContainer[]>(`${baseUrl}:${port}/api/lista-navegable/configuracion`, options)
  }
}
