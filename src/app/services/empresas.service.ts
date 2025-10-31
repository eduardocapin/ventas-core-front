import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Empresa {
  idEmpresa: number;
  Nombre: string;
  Descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = `${environment.apiUrl}/api/empresas`;

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl);
  }
}
