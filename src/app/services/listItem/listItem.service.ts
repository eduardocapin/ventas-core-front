import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { LoginService } from '../auth/login.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditPopupComponent } from 'src/app/configuration/configuration-general/profile-edit-popup/profile-edit-popup.component';
import { ReasonsRejectionsComponent } from 'src/app/configuration/configuration-general/reasons-rejections/reasons-rejections.component';
import { ConfigurationContainer } from 'src/app/models/configurationContainer.model';
import { AddCompetitorComponent } from 'src/app/configuration/configuration-general/add-competitor/add-competitor.component';
import { CompanySelectorConfigComponent } from 'src/app/configuration/configuration-general/company-selector-config/company-selector-config.component';
import { environment } from 'src/environments/environment';
import { LanguageService } from '../language/language.service';
@Injectable({
  providedIn: 'root',
})
export class ListItemService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient,
    private _loginServices: LoginService,
    public dialog: MatDialog,
    private languageService: LanguageService
  ) { }

  private functionRegistry: { [key: string]: () => void } = {
    openProfileEditPopup: () => {
      const dialogRef = this.dialog.open(ProfileEditPopupComponent, {
        width: 'auto',
        disableClose: true,
      });
    },
    openReasonsRejections: () => {
      const dialogRef = this.dialog.open(ReasonsRejectionsComponent, {
        width: 'auto',
        disableClose: true,
        data: { autoClose: false },
      });
    },
    openSelectorConfig: () => {
      const dialogRef = this.dialog.open(CompanySelectorConfigComponent, {
        width: 'auto',
        disableClose: true,
      });
    },
    openCompetitor: () => {
      const dialogRef = this.dialog.open(AddCompetitorComponent, {
        width: '660px',
        disableClose: true,
        data: { autoClose: false },
      });
    },
  };

  executeFunction(functionName: string) {
    if (this.functionRegistry[functionName]) {
      this.functionRegistry[functionName]();
    } else {
      console.error(`Function ${functionName} not found`);
    }
  }
  getConfigContainers(): Observable<ConfigurationContainer[]> {
    const idioma = this.languageService.getCurrentLanguage();
    let options = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer ${this._loginServices.getToken()}`
      ),
    };
    return this._http.get<ConfigurationContainer[]>(
      `${this.apiUrl}/api/nav-lists/configuracion?idioma=${idioma}`,
      options
    ).pipe(
      map((data: any) => {
        console.log(data)
        return data;
      })
    );
  }
}
