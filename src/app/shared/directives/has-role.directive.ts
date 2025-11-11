import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthorizationService } from '../../services/auth/authorization.service';

/**
 * Directiva para mostrar u ocultar elementos basándose en roles del usuario
 * 
 * @example
 * <div *hasRole="['Admin']">Solo Admin puede ver esto</div>
 * <div *hasRole="['Admin', 'Editor']">Admin o Editor pueden ver esto</div>
 */
@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  private roles: string[] = [];

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: AuthorizationService
  ) {}

  @Input() set hasRole(roles: string[]) {
    this.roles = roles;
    this.updateView();
  }

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    this.viewContainer.clear();

    if (!this.roles || this.roles.length === 0) {
      // Si no hay roles especificados, mostrar
      this.viewContainer.createEmbeddedView(this.templateRef);
      return;
    }

    // Verificar si el usuario tiene al menos uno de los roles
    const hasRole = this.authorizationService.hasAnyRole(this.roles);
    
    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
