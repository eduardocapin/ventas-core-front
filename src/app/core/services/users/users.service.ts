import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface User {
  id: number;
  email: string;
  name: string;
  position_company: string;
  image: string;
  deleted: boolean;
  roles: { id: number; name: string; description: string }[];
  permissions: { id: number; name: string; description: string }[];
  rolePermissions?: { id: number; name: string; description: string }[];
  empresas?: { id: number; nombre: string }[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users`, {
      headers: this.getHeaders()
    });
  }

  getActiveUsersCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/api/users/active-count`, {
      headers: this.getHeaders()
    });
  }

  getUsersPaginated(
    selectedFilters: any[] = [],
    searchTerm: string = '',
    currentPage: number = 1,
    itemsPerPage: number = 10,
    sortColumn: string = '',
    sortDirection: string = 'asc'
  ): Observable<any> {
    const body = {
      selectedFilters,
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

  createUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/users`, userData, { headers: this.getHeaders() });
  }

  updateUser(userData: any): Observable<any> {
    const userId = userData.id;
    return this.http.patch(`${this.apiUrl}/api/users/${userId}`, userData, { headers: this.getHeaders() });
  }

  /**
   * Obtener perfil del usuario actual con empresas asignadas
   */
  getCurrentUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/users/profile/me`, {
      headers: this.getHeaders()
    });
  }

  /**
   * Actualizar idioma del usuario actual
   */
  updateUserLanguage(lang: string): Observable<any> {
    const email = localStorage.getItem('email');
    console.log('Enviando actualización de idioma:', lang, 'para email:', email);
    return this.http.post(`${this.apiUrl}/api/users/update-language`, { email, lang }, {
      headers: this.getHeaders()
    });
  }
}
