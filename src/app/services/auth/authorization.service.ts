import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Cargar roles y permisos del usuario desde el backend
   * Se debe llamar después del login
   */
  loadAuthorizationInfo(token: string): Observable<any> {
    const options = {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
    };

    return this.http.get<any>(`${this.apiUrl}/api/authorization/me`, options).pipe(
      map((auth) => {
        localStorage.setItem('roles', JSON.stringify(auth.roles || []));
        localStorage.setItem('permissions', JSON.stringify(auth.permissions || []));
        return auth;
      }),
      catchError(() => {
        // Si falla, limpiar
        localStorage.setItem('roles', JSON.stringify([]));
        localStorage.setItem('permissions', JSON.stringify([]));
        return of({ roles: [], permissions: [] });
      })
    );
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes(permission);
  }

  /**
   * Verificar si el usuario tiene al menos uno de los permisos
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.some(p => userPermissions.includes(p));
  }

  /**
   * Verificar si el usuario tiene todos los permisos
   */
  hasAllPermissions(permissions: string[]): boolean {
    const userPermissions = this.getPermissions();
    return permissions.every(p => userPermissions.includes(p));
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  /**
   * Verificar si el usuario tiene al menos uno de los roles
   */
  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getRoles();
    return roles.some(r => userRoles.includes(r));
  }

  /**
   * Verificar si el usuario es Admin
   */
  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  /**
   * Verificar si el usuario es Editor
   */
  isEditor(): boolean {
    return this.hasRole('Editor');
  }

  /**
   * Verificar si el usuario es Admin o Editor
   */
  isAdminOrEditor(): boolean {
    return this.hasAnyRole(['Admin', 'Editor']);
  }

  /**
   * Obtener todos los roles del usuario
   */
  getRoles(): string[] {
    try {
      const roles = localStorage.getItem('roles');
      return roles ? JSON.parse(roles) : [];
    } catch {
      return [];
    }
  }

  /**
   * Obtener todos los permisos del usuario
   */
  getPermissions(): string[] {
    try {
      const permissions = localStorage.getItem('permissions');
      return permissions ? JSON.parse(permissions) : [];
    } catch {
      return [];
    }
  }

  /**
   * Limpiar roles y permisos (llamar en logout)
   */
  clearAuthorization(): void {
    localStorage.removeItem('roles');
    localStorage.removeItem('permissions');
  }
}
