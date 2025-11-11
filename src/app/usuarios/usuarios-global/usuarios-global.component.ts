import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { AuthorizationService } from '../../services/auth/authorization.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

interface Usuario {
  id: number;
  email: string;
  name: string;
  position_company: string;
  image: string;
  deleted: boolean;
  roles: Permission[];
  permissions: Permission[];
  rolePermissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-usuarios-global',
  templateUrl: './usuarios-global.component.html',
  styleUrls: ['./usuarios-global.component.scss']
})
export class UsuariosGlobalComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = false;
  canAssignRoles = false;
  canAssignPermissions = false;
  isAdmin = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // Ordenamiento
  sortColumn: string = '';
  sortDirection: string = 'asc';

  // Búsqueda
  searchTerm: string = '';

  allRoles: Permission[] = [
    { id: 1, name: 'Admin', description: 'Administrador del sistema' },
    { id: 2, name: 'Editor', description: 'Puede editar información' },
    { id: 3, name: 'Usuario', description: 'Usuario estándar' }
  ];
  allPermissions: Permission[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthorizationService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.canAssignRoles = this.authService.hasPermission('ASIGNACION_ROLES_USUARIOS');
    this.canAssignPermissions = this.authService.hasPermission('ASIGNACION_PERMISOS_USUARIOS');
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadUsuarios();
    this.loadPermissions();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuariosPaginated(
      this.searchTerm,
      this.currentPage,
      this.itemsPerPage,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response) => {
        this.usuarios = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error: () => {
        this.notification.showError('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsuarios();
  }

  onItemsPerPageChanged(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadUsuarios();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadUsuarios();
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadUsuarios();
  }

  loadPermissions(): void {
    this.usuariosService.getAllPermissions().subscribe({
      next: (permissions) => this.allPermissions = permissions,
      error: () => console.error('Error al cargar permisos')
    });
  }

  hasRole(usuario: Usuario, roleId: number): boolean {
    return usuario.roles.some(role => role.id === roleId);
  }

  getSelectedRolesCount(usuario: Usuario): number {
    return usuario.roles.length;
  }

  hasPermission(usuario: Usuario, permissionId: number): boolean {
    const hasDirectPermission = usuario.permissions.some(p => p.id === permissionId);
    const hasRolePermission = usuario.rolePermissions ? usuario.rolePermissions.some(p => p.id === permissionId) : false;
    return hasDirectPermission || hasRolePermission;
  }

  toggleRoleCheckbox(usuario: Usuario, roleId: number, event: any): void {
    const hasRole = this.hasRole(usuario, roleId);
    
    // Si intenta desmarcar el único rol que tiene
    if (hasRole && usuario.roles.length === 1) {
      this.notification.showWarning('No se puede quitar todos los roles. Debe tener al menos uno asignado.');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (!this.canAssignRoles) {
      this.notification.showWarning('No tienes permiso para asignar roles');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const action = hasRole ? 'remove' : 'assign';
    this.usuariosService.toggleRole(usuario.id, roleId, action).subscribe({
      next: () => {
        // Actualizar localmente sin recargar
        if (action === 'assign') {
          const roleToAdd = this.allRoles.find(r => r.id === roleId);
          if (roleToAdd && !usuario.roles.some(r => r.id === roleId)) {
            usuario.roles.push(roleToAdd);
          }
        } else {
          usuario.roles = usuario.roles.filter(r => r.id !== roleId);
        }
        this.notification.showSuccess(`Rol ${hasRole ? 'removido' : 'asignado'} correctamente`);
      },
      error: () => this.notification.showError('Error al modificar rol')
    });
  }

  onRoleItemClick(usuario: Usuario, roleId: number, event: any): void {
    const hasRole = this.hasRole(usuario, roleId);
    
    // Si es el único rol e intenta hacer clic en el item
    if (hasRole && usuario.roles.length === 1) {
      this.notification.showWarning('No se puede quitar todos los roles. Debe tener al menos uno asignado.');
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  toggleRole(usuario: Usuario, roleId: number): void {
    if (!this.canAssignRoles) {
      this.notification.showWarning('No tienes permiso para asignar roles');
      return;
    }

    const hasRole = this.hasRole(usuario, roleId);
    if (hasRole && usuario.roles.length === 1) {
      this.notification.showWarning('Se debe tener al menos un rol seleccionado');
      return;
    }

    const action = hasRole ? 'remove' : 'assign';
    this.usuariosService.toggleRole(usuario.id, roleId, action).subscribe({
      next: () => {
        this.notification.showSuccess(`Rol ${hasRole ? 'removido' : 'asignado'} correctamente`);
        this.updateSingleUser(usuario.id);
      },
      error: () => this.notification.showError('Error al modificar rol')
    });
  }

  isPermissionFromRole(usuario: Usuario, permissionId: number): boolean {
    return usuario.rolePermissions?.some(p => p.id === permissionId) || false;
  }

  getSelectedPermissionsCount(usuario: Usuario): number {
    return usuario.permissions.filter(p => !this.isPermissionFromRole(usuario, p.id)).length;
  }

  togglePermission(usuario: Usuario, permissionId: number, event: any): void {
    if (!this.canAssignPermissions) {
      this.notification.showWarning('No tienes permiso para asignar permisos');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Si el permiso viene del rol, no se puede desmarcar
    if (this.isPermissionFromRole(usuario, permissionId)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const hasPermission = usuario.permissions.some(p => p.id === permissionId);
    const action = hasPermission ? 'remove' : 'assign';

    this.usuariosService.togglePermission(usuario.id, permissionId, action).subscribe({
      next: () => {
        // Actualizar localmente sin recargar
        if (action === 'assign') {
          const permissionToAdd = this.allPermissions.find(p => p.id === permissionId);
          if (permissionToAdd && !usuario.permissions.some(p => p.id === permissionId)) {
            usuario.permissions.push(permissionToAdd);
          }
        } else {
          usuario.permissions = usuario.permissions.filter(p => p.id !== permissionId);
        }
        this.notification.showSuccess(`Permiso ${hasPermission ? 'removido' : 'asignado'} correctamente`);
      },
      error: () => this.notification.showError('Error al modificar permiso')
    });
  }

  onPermissionsChange(usuario: Usuario, selectedOptions: any): void {
    if (!this.canAssignPermissions) {
      this.notification.showWarning('No tienes permiso para asignar permisos');
      return;
    }

    // Convertir HTMLOptionsCollection a array de IDs
    const selectedPermissions: number[] = Array.from(selectedOptions)
      .filter((option: any) => option.selected && !option.disabled)
      .map((option: any) => parseInt(option.value));

    const rolePermissions = usuario.rolePermissions?.map(p => p.id) || [];
    const currentPermissions = usuario.permissions
      .filter(p => !this.isPermissionFromRole(usuario, p.id))
      .map(p => p.id);
    const selectedDirect = selectedPermissions.filter(id => !rolePermissions.includes(id));

    const toAdd = selectedDirect.filter(id => !currentPermissions.includes(id));
    const toRemove = currentPermissions.filter(id => !selectedDirect.includes(id));

    if (toAdd.length === 0 && toRemove.length === 0) return;

    const operations = [
      ...toAdd.map(id => this.usuariosService.togglePermission(usuario.id, id, 'assign')),
      ...toRemove.map(id => this.usuariosService.togglePermission(usuario.id, id, 'remove'))
    ];

    forkJoin(operations).subscribe({
      next: () => {
        this.notification.showSuccess('Permisos actualizados correctamente');
        this.updateSingleUser(usuario.id);
      },
      error: () => {
        this.notification.showError('Error al actualizar permisos');
        this.updateSingleUser(usuario.id);
      }
    });
  }

  getSelectedPermissions(usuario: Usuario): number[] {
    const direct = usuario.permissions.map(p => p.id);
    const fromRoles = usuario.rolePermissions?.map(p => p.id) || [];
    return [...new Set([...direct, ...fromRoles])];
  }

  deleteUser(usuario: Usuario): void {
    if (!this.isAdmin) {
      this.notification.showWarning('Solo los administradores pueden eliminar usuarios');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Está seguro de que desea eliminar al usuario "${usuario.name}"? Esta acción marcará al usuario como eliminado.`
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usuariosService.deleteUser(usuario.id).subscribe({
          next: () => {
            this.notification.showSuccess('Usuario eliminado correctamente');
            this.updateSingleUser(usuario.id);
          },
          error: () => this.notification.showError('Error al eliminar usuario')
        });
      }
    });
  }

  private updateSingleUser(userId: number): void {
    // Recargar la página actual después de actualizar un usuario
    this.loadUsuarios();
  }
}
