import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/auth/authorization.service';

/**
 * Directiva para mostrar u ocultar elementos basándose en permisos del usuario
 * 
 * @example
 * <button *hasPermission="['CONFIGURACION_BORRADO_COMPETIDORES']">Eliminar</button>
 * <div *hasPermission="['PERMISO_1', 'PERMISO_2']">Usuario necesita al menos uno</div>
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit {
  private permissions: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {}

  @Input() set hasPermission(permissions: string[]) {
    this.permissions = permissions;
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();

    if (!this.permissions || this.permissions.length === 0) {
      // Si no hay permisos especificados, mostrar
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Verificar si el usuario tiene al menos uno de los permisos
    const hasPermission = this.authorizationService.hasAnyPermission(this.permissions);
    
    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
