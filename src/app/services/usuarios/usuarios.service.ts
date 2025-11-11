import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface Usuario {
  id: number;
  email: string;
  name: string;
  position_company: string;
  image: string;
  deleted: boolean;
  roles: { id: number; name: string; description: string }[];
  permissions: { id: number; name: string; description: string }[];
  rolePermissions?: { id: number; name: string; description: string }[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token = localStorage.getItem('token');
    if (token) {
      // El token está serializado con JSON.stringify, hay que parsearlo
      token = JSON.parse(token);
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/api/users`, {
      headers: this.getHeaders()
    });
  }

  getUsuariosPaginated(
    searchTerm: string = '',
    currentPage: number = 1,
    itemsPerPage: number = 10,
    sortColumn: string = '',
    sortDirection: string = 'asc'
  ): Observable<any> {
    const body = {
      searchTerm,
      currentPage,
      itemsPerPage,
      sortColumn,
      sortDirection
    };
    return this.http.post<any>(`${this.apiUrl}/api/users/list`, body, {
      headers: this.getHeaders()
    });
  }

  getAllPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/api/authorization/permissions`, {
      headers: this.getHeaders()
    });
  }

  toggleRole(userId: number, roleId: number, action: 'assign' | 'remove'): Observable<any> {
    const url = action === 'assign' 
      ? `${this.apiUrl}/api/users/assign-role`
      : `${this.apiUrl}/api/users/remove-role`;
    
    // Ambos usan POST
    return this.http.post(url, { userId, roleId }, { headers: this.getHeaders() });
  }

  togglePermission(userId: number, permissionId: number, action: 'assign' | 'remove'): Observable<any> {
    const url = action === 'assign'
      ? `${this.apiUrl}/api/users/assign-permission`
      : `${this.apiUrl}/api/users/remove-permission`;
    
    // Ambos usan POST
    return this.http.post(url, { userId, permissionId }, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/users/${userId}`, { headers: this.getHeaders() });
  }
}
