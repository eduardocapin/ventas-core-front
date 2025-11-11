import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { AuthorizationService } from '../../services/auth/authorization.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

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

interface Role {
  id: number;
  name: string;
  description: string;
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
  displayedColumns: string[] = ['name', 'email', 'position_company', 'roles', 'permissions', 'actions'];
  loading = false;

  // Permisos del usuario actual
  canAssignRoles = false;
  canAssignPermissions = false;

  // Listas de roles y permisos disponibles
  allRoles: Role[] = [
    { id: 1, name: 'Admin', description: 'Administrador del sistema' },
    { id: 2, name: 'Editor', description: 'Puede editar información' },
    { id: 3, name: 'Usuario', description: 'Usuario estándar' }
  ];

  allPermissions: Permission[] = [];

  constructor(
    private usuariosService: UsuariosService,
    private authService: AuthorizationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkPermissions();
    this.loadUsuarios();
    this.loadPermissions();
  }

  checkPermissions(): void {
    this.canAssignRoles = this.authService.hasPermission('ASIGNACION_ROLES_USUARIOS');
    this.canAssignPermissions = this.authService.hasPermission('ASIGNACION_PERMISOS_USUARIOS');
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.snackBar.open('Error al cargar usuarios', 'Cerrar', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadPermissions(): void {
    this.usuariosService.getAllPermissions().subscribe({
      next: (permissions) => {
        this.allPermissions = permissions;
      },
      error: (error) => {
        console.error('Error al cargar permisos:', error);
      }
    });
  }

  hasRole(usuario: Usuario, roleId: number): boolean {
    return usuario.roles.some(role => role.id === roleId);
  }

  hasPermission(usuario: Usuario, permissionId: number): boolean {
    return usuario.permissions.some(permission => permission.id === permissionId);
  }

  toggleRole(usuario: Usuario, roleId: number): void {
    if (!this.canAssignRoles) {
      this.snackBar.open('No tienes permiso para asignar roles', 'Cerrar', { duration: 3000 });
      return;
    }

    const hasRole = this.hasRole(usuario, roleId);
    const action = hasRole ? 'remove' : 'assign';

    this.usuariosService.toggleRole(usuario.id, roleId, action).subscribe({
      next: () => {
        this.snackBar.open(
          `Rol ${hasRole ? 'removido' : 'asignado'} correctamente`,
          'Cerrar',
          { duration: 2000 }
        );
        // Actualizar solo el usuario específico
        this.updateSingleUser(usuario.id);
      },
      error: (error) => {
        console.error('Error al modificar rol:', error);
        this.snackBar.open('Error al modificar rol', 'Cerrar', { duration: 3000 });
      }
    });
  }

  togglePermission(usuario: Usuario, permissionId: number): void {
    if (!this.canAssignPermissions) {
      this.snackBar.open('No tienes permiso para asignar permisos', 'Cerrar', { duration: 3000 });
      return;
    }

    const hasPermission = this.hasPermission(usuario, permissionId);
    const action = hasPermission ? 'remove' : 'assign';

    this.usuariosService.togglePermission(usuario.id, permissionId, action).subscribe({
      next: () => {
        this.snackBar.open(
          `Permiso ${hasPermission ? 'removido' : 'asignado'} correctamente`,
          'Cerrar',
          { duration: 3000 }
        );
        this.loadUsuarios();
      },
      error: (error) => {
        console.error('Error al modificar permiso:', error);
        this.snackBar.open('Error al modificar permiso', 'Cerrar', { duration: 3000 });
      }
    });
  }

  getRolesList(usuario: Usuario): string {
    return usuario.roles.map(role => role.name).join(', ') || 'Sin roles';
  }

  getPermissionsList(usuario: Usuario): string {
    return usuario.permissions.map(p => p.name).join(', ') || 'Sin permisos';
  }

  /**
   * Obtiene los IDs de permisos que vienen del rol (no directos del usuario)
   */
  getPermissionsFromRoles(usuario: Usuario): number[] {
    // Usar los permisos que vienen del backend (rolePermissions)
    if (usuario.rolePermissions && usuario.rolePermissions.length > 0) {
      return usuario.rolePermissions.map(p => p.id);
    }
    return [];
  }

  /**
   * Determina si un permiso está asignado por rol (no se puede desmarcar)
   */
  isPermissionFromRole(usuario: Usuario, permissionId: number): boolean {
    const rolePermissions = this.getPermissionsFromRoles(usuario);
    return rolePermissions.includes(permissionId);
  }

  /**
   * Maneja el cambio en el dropdown de permisos
   */
  onPermissionsChange(usuario: Usuario, selectedPermissions: any): void {
    if (!this.canAssignPermissions) {
      this.snackBar.open('No tienes permiso para asignar permisos', 'Cerrar', { duration: 3000 });
      return;
    }

    // Obtener permisos actuales del usuario (solo directos, no de roles)
    const currentUserPermissions = usuario.permissions
      .filter(p => !this.isPermissionFromRole(usuario, p.id))
      .map(p => p.id);

    // Permisos que vienen de roles (no se pueden modificar)
    const rolePermissions = this.getPermissionsFromRoles(usuario);

    // Filtrar solo los permisos directos seleccionados (quitar los de roles)
    const selectedDirectPermissions = (selectedPermissions as number[]).filter(
      id => !rolePermissions.includes(id)
    );

    // Encontrar permisos a agregar
    const toAdd = selectedDirectPermissions.filter(
      id => !currentUserPermissions.includes(id)
    );

    // Encontrar permisos a remover
    const toRemove = currentUserPermissions.filter(
      id => !selectedDirectPermissions.includes(id)
    );

    // Ejecutar las operaciones
    this.processPermissionChanges(usuario, toAdd, toRemove);
  }

  /**
   * Procesa los cambios de permisos (agregar y remover)
   */
  private processPermissionChanges(usuario: Usuario, toAdd: number[], toRemove: number[]): void {
    const operations = [
      ...toAdd.map(id => this.usuariosService.togglePermission(usuario.id, id, 'assign')),
      ...toRemove.map(id => this.usuariosService.togglePermission(usuario.id, id, 'remove'))
    ];

    if (operations.length === 0) {
      return;
    }

    // Usar forkJoin para ejecutar todas las operaciones en paralelo
    forkJoin(operations).subscribe({
      next: () => {
        this.snackBar.open('Permisos actualizados correctamente', 'Cerrar', { duration: 2000 });
        // En lugar de recargar toda la lista, solo actualizamos el usuario específico
        this.updateSingleUser(usuario.id);
      },
      error: (error) => {
        console.error('Error al actualizar permisos:', error);
        this.snackBar.open('Error al actualizar permisos', 'Cerrar', { duration: 3000 });
        this.updateSingleUser(usuario.id);
      }
    });
  }

  /**
   * Actualiza solo un usuario específico sin recargar toda la lista
   */
  private updateSingleUser(userId: number): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        const updatedUser = usuarios.find(u => u.id === userId);
        if (updatedUser) {
          const index = this.usuarios.findIndex(u => u.id === userId);
          if (index !== -1) {
            // Actualizar solo el usuario específico
            this.usuarios[index] = updatedUser;
            // Forzar detección de cambios
            this.usuarios = [...this.usuarios];
          }
        }
      },
      error: (error) => {
        console.error('Error al actualizar usuario:', error);
      }
    });
  }

  /**
   * Obtiene los permisos seleccionados (directos + de roles)
   */
  getSelectedPermissions(usuario: Usuario): number[] {
    const directPermissions = usuario.permissions.map(p => p.id);
    const rolePermissions = this.getPermissionsFromRoles(usuario);
    
    // Combinar y eliminar duplicados
    return [...new Set([...directPermissions, ...rolePermissions])];
  }
}
