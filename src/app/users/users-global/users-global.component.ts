import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { UsersService } from '../../services/users/users.service';
import { AuthorizationService } from '../../services/auth/authorization.service';
import { NotificationService } from '../../services/notification/notification.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';

interface User {
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
  selector: 'mobentis-users-global',
  templateUrl: './users-global.component.html',
  styleUrls: ['./users-global.component.scss']
})
export class UsersGlobalComponent implements OnInit {
  users: User[] = [];
  loading = false;
  canAssignRoles = false;
  canAssignPermissions = false;
  isAdmin = false;

  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;

  // Ordenamiento
  sortColumn: string = '';
  sortDirection: string = 'asc';

  // Búsqueda
  searchTerm: string = '';

  // Filtros
  selectedFilters: any[] = [];

  allRoles: Permission[] = [];
  allPermissions: Permission[] = [];

  constructor(
    private usersService: UsersService,
    private authService: AuthorizationService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {}

  ngOnInit(): void {
    this.canAssignRoles = this.authService.hasPermission('ASIGNACION_ROLES_USUARIOS');
    this.canAssignPermissions = this.authService.hasPermission('ASIGNACION_PERMISOS_USUARIOS');
    this.isAdmin = this.authService.hasRole('Admin');
    this.loadRolesForDropdowns();
    this.loadUsers();
  }

  loadRolesForDropdowns(): void {
    // Cargar roles para los dropdowns de la tabla
    this.authService.getAllRoles().subscribe({
      next: (roles: any[]) => {
        this.allRoles = roles;
      },
      error: (error: any) => {
        console.error('Error cargando roles:', error);
      }
    });

    // Cargar permisos para los dropdowns de la tabla
    this.usersService.getAllPermissions().subscribe({
      next: (permissions: any[]) => {
        this.allPermissions = permissions;
      },
      error: (error: any) => {
        console.error('Error cargando permisos:', error);
      }
    });
  }

  get canCreateUser(): boolean {
    return this.isAdmin || this.authService.hasPermission('VISUALIZADO_USUARIOS');
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getUsersPaginated(
      this.selectedFilters,
      this.searchTerm,
      this.currentPage,
      this.itemsPerPage,
      this.sortColumn,
      this.sortDirection
    ).subscribe({
      next: (response: any) => {
        this.users = response.items;
        this.totalItems = response.totalItems;
        this.loading = false;
      },
      error: () => {
        this.notification.showError('Error al cargar Users');
        this.loading = false;
      }
    });
  }

  onFiltersChanged(filters: { [key: string]: any }): void {
    // Convertir el objeto de filtros a un array para el backend
    this.selectedFilters = Object.keys(filters).map(key => ({
      id: key,
      ...filters[key]
    }));
    this.currentPage = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onItemsPerPageChanged(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadUsers();
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.currentPage = 1;
    this.loadUsers();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadUsers();
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  hasRole(user: User, roleId: number): boolean {
    return user.roles.some(role => role.id === roleId);
  }

  getSelectedRolesCount(user: User): number {
    return user.roles.length;
  }

  getSelectedRoleName(user: User): string {
    return user.roles.length > 0 ? user.roles[0].name : 'Sin rol';
  }

  hasPermission(user: User, permissionId: number): boolean {
    const hasDirectPermission = user.permissions.some(p => p.id === permissionId);
    const hasRolePermission = user.rolePermissions ? user.rolePermissions.some(p => p.id === permissionId) : false;
    return hasDirectPermission || hasRolePermission;
  }

  toggleRoleCheckbox(user: User, roleId: number, event: any): void {
    const hasRole = this.hasRole(user, roleId);
    
    // Si ya tiene este rol, no hacer nada (siempre debe tener un rol)
    if (hasRole) {
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

    // Obtener el rol anterior para removerlo
    const previousRoleId = user.roles.length > 0 ? user.roles[0].id : null;

    // Asignar el nuevo rol
    this.usersService.toggleRole(user.id, roleId, 'assign').subscribe({
      next: () => {
        // Remover el rol anterior si existe
        if (previousRoleId && previousRoleId !== roleId) {
          this.usersService.toggleRole(user.id, previousRoleId, 'remove').subscribe({
            next: () => {
              // Actualizar localmente: reemplazar el rol
              const roleToAdd = this.allRoles.find(r => r.id === roleId);
              if (roleToAdd) {
                user.roles = [roleToAdd];
              }
              this.notification.showSuccess('Rol actualizado correctamente');
            },
            error: () => {
              // Si falla al remover el anterior, recargar para mantener consistencia
              this.loadUsers();
              this.notification.showError('Error al actualizar rol');
            }
          });
        } else {
          // Si no había rol anterior, solo agregar el nuevo
          const roleToAdd = this.allRoles.find(r => r.id === roleId);
          if (roleToAdd) {
            user.roles = [roleToAdd];
          }
          this.notification.showSuccess('Rol asignado correctamente');
        }
      },
      error: () => {
        this.notification.showError('Error al asignar rol');
      }
    });
  }

  onRoleItemClick(user: User, roleId: number, event: any): void {
    const hasRole = this.hasRole(user, roleId);
    
    // Si es el único rol e intenta hacer clic en el item
    if (hasRole && user.roles.length === 1) {
      this.notification.showWarning('No se puede quitar todos los roles. Debe tener al menos uno asignado.');
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  toggleRole(user: User, roleId: number): void {
    if (!this.canAssignRoles) {
      this.notification.showWarning('No tienes permiso para asignar roles');
      return;
    }

    const hasRole = this.hasRole(user, roleId);
    if (hasRole && user.roles.length === 1) {
      this.notification.showWarning('Se debe tener al menos un rol seleccionado');
      return;
    }

    const action = hasRole ? 'remove' : 'assign';
    this.usersService.toggleRole(user.id, roleId, action).subscribe({
      next: () => {
        this.notification.showSuccess(`Rol ${hasRole ? 'removido' : 'asignado'} correctamente`);
        this.updateSingleUser(user.id);
      },
      error: () => this.notification.showError('Error al modificar rol')
    });
  }

  isPermissionFromRole(user: User, permissionId: number): boolean {
    return user.rolePermissions?.some(p => p.id === permissionId) || false;
  }

  getSelectedPermissionsCount(user: User): number {
    return user.permissions.filter(p => !this.isPermissionFromRole(user, p.id)).length;
  }

  togglePermission(user: User, permissionId: number, event: any): void {
    if (!this.canAssignPermissions) {
      this.notification.showWarning('No tienes permiso para asignar permisos');
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // Si el permiso viene del rol, no se puede desmarcar
    if (this.isPermissionFromRole(user, permissionId)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const hasPermission = user.permissions.some(p => p.id === permissionId);
    const action = hasPermission ? 'remove' : 'assign';

    this.usersService.togglePermission(user.id, permissionId, action).subscribe({
      next: () => {
        // Actualizar localmente sin recargar
        if (action === 'assign') {
          const permissionToAdd = this.allPermissions.find(p => p.id === permissionId);
          if (permissionToAdd && !user.permissions.some(p => p.id === permissionId)) {
            user.permissions.push(permissionToAdd);
          }
        } else {
          user.permissions = user.permissions.filter(p => p.id !== permissionId);
        }
        this.notification.showSuccess(`Permiso ${hasPermission ? 'removido' : 'asignado'} correctamente`);
      },
      error: () => this.notification.showError('Error al modificar permiso')
    });
  }

  onPermissionsChange(user: User, selectedOptions: any): void {
    if (!this.canAssignPermissions) {
      this.notification.showWarning('No tienes permiso para asignar permisos');
      return;
    }

    // Convertir HTMLOptionsCollection a array de IDs
    const selectedPermissions: number[] = Array.from(selectedOptions)
      .filter((option: any) => option.selected && !option.disabled)
      .map((option: any) => parseInt(option.value));

    const rolePermissions = user.rolePermissions?.map(p => p.id) || [];
    const currentPermissions = user.permissions
      .filter(p => !this.isPermissionFromRole(user, p.id))
      .map(p => p.id);
    const selectedDirect = selectedPermissions.filter(id => !rolePermissions.includes(id));

    const toAdd = selectedDirect.filter(id => !currentPermissions.includes(id));
    const toRemove = currentPermissions.filter(id => !selectedDirect.includes(id));

    if (toAdd.length === 0 && toRemove.length === 0) return;

    const operations = [
      ...toAdd.map(id => this.usersService.togglePermission(user.id, id, 'assign')),
      ...toRemove.map(id => this.usersService.togglePermission(user.id, id, 'remove'))
    ];

    forkJoin(operations).subscribe({
      next: () => {
        this.notification.showSuccess('Permisos actualizados correctamente');
        this.updateSingleUser(user.id);
      },
      error: () => {
        this.notification.showError('Error al actualizar permisos');
        this.updateSingleUser(user.id);
      }
    });
  }

  getSelectedPermissions(user: User): number[] {
    const direct = user.permissions.map(p => p.id);
    const fromRoles = user.rolePermissions?.map(p => p.id) || [];
    return [...new Set([...direct, ...fromRoles])];
  }

  deleteUser(user: User): void {
    if (!this.isAdmin) {
      this.notification.showWarning('Solo los administradores pueden eliminar Users');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Está seguro de que desea eliminar al User "${user.name}"? Esta acción marcará al User como eliminado.`
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.usersService.deleteUser(user.id).subscribe({
          next: () => {
            this.notification.showSuccess('User eliminado correctamente');
            this.updateSingleUser(user.id);
          },
          error: () => this.notification.showError('Error al eliminar User')
        });
      }
    });
  }

  private updateSingleUser(userId: number): void {
    // Recargar la página actual después de actualizar un User
    this.loadUsers();
  }

  openCreateUserDialog(): void {
    if (!this.canCreateUser) {
      this.notification.showWarning('No tienes permisos para crear Users');
      return;
    }

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container'
      // No pasamos data, el componente detectará que es modo creación
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User creado exitosamente, recargar la lista
        this.loadUsers();
      }
    });
  }

  openEditUserDialog(user: User): void {
    if (!this.isAdmin && !this.canCreateUser) {
      this.notification.showWarning('No tienes permisos para editar Users');
      return;
    }

    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '1100px',
      maxWidth: '95vw',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User actualizado exitosamente, recargar la lista
        this.loadUsers();
      }
    });
  }
}
