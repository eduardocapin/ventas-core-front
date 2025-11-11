import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  
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

    // Obtener roles y permisos requeridos de la ruta
    const requiredRoles = route.data['roles'] as string[];
    const requiredPermissions = route.data['permissions'] as string[];
    
    // Si no hay roles ni permisos especificados, permitir acceso (solo requiere autenticación)
    if ((!requiredRoles || requiredRoles.length === 0) && 
        (!requiredPermissions || requiredPermissions.length === 0)) {
      return true;
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles && requiredRoles.length > 0 
      ? this.authorizationService.hasAnyRole(requiredRoles) 
      : false;

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    const hasPermission = requiredPermissions && requiredPermissions.length > 0
      ? this.authorizationService.hasAnyPermission(requiredPermissions)
      : false;
    
    // Permitir acceso si tiene el rol O el permiso (lógica OR)
    if (hasRole || hasPermission) {
      return true;
    }

    // Si no tiene ni rol ni permiso, redirigir
    this.router.navigate(['/mobentis/dashboard/global']);
    return false;
  }
}
