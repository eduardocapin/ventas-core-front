import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Configuracion {
  Id: number;
  Nombre: string;
  Descripcion: string;
  IdAgente: number;
  Valor: any; // Puede ser boolean, string, number, etc.
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private apiUrl = `${environment.apiUrl}/api/configuration`;

  constructor(private http: HttpClient) { }

  getConfigurationByName(name: string): Observable<Configuracion> {
    return this.http.get<Configuracion>(`${this.apiUrl}/${name}`);
  }
}
