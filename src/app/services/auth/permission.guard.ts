import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  
  constructor(
    private authorizationService: AuthorizationService,
    private loginService: LoginService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // Verificar primero si está autenticado
    if (!this.loginService.getToken()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Obtener permisos requeridos de la ruta
    const requiredPermissions = route.data['permissions'] as string[];
    
    // Si no hay permisos especificados, permitir acceso (solo requiere autenticación)
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = this.authorizationService.hasAnyPermission(requiredPermissions);
    
    if (!hasPermission) {
      // Redirigir a página de acceso denegado o dashboard
      this.router.navigate(['/mobentis/dashboard/global']);
      return false;
    }

    return true;
  }
}
