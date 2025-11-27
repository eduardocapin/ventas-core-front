import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../../services/users/users.service';
import { AuthorizationService } from '../../services/auth/authorization.service';
import { NotificationService } from '../../services/notification/notification.service';
import { EmpresasService } from '../../services/empresas.service';
import { Md5 } from 'ts-md5';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Empresa {
  id: number;
  nombre: string;
}

interface User {
  id?: number;
  name: string;
  email: string;
  position_company: string;
  image: string;
  roles: Role[];
  permissions: Permission[];
  empresas: Empresa[];
  rolePermissions?: Permission[];
}

@Component({
  selector: 'mobentis-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss']
})
export class UserFormDialogComponent implements OnInit {
  // Form fields
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  positionCompany: string = '';
  image: string = '';
  selectedRoleIds: number[] = [];
  selectedPermissionIds: number[] = [];
  selectedEmpresaIds: number[] = [];

  // Available options
  allRoles: Role[] = [];
  allPermissions: Permission[] = [];
  allEmpresas: Empresa[] = [];

  // UI state
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  imagePreview: string | null = null;
  changePassword: boolean = false;
  permissionsExpanded: boolean = false; // Estado del dropdown de permisos

  // Modo del diálogo
  isEditMode: boolean = false;
  userId?: number;

  constructor(
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
    private usersService: UsersService,
    private authorizationService: AuthorizationService,
    private notificationService: NotificationService,
    private empresasService: EmpresasService
  ) {}

  ngOnInit(): void {
    // Detectar si es modo edición o creación
    this.isEditMode = !!(this.data?.user?.id);
    
    this.loadRolesAndPermissions();
    
    if (this.isEditMode) {
      this.loadUserData();
    }
  }

  loadUserData(): void {
    if (!this.data?.user) return;
    
    const user = this.data.user;
    this.userId = user.id;
    this.name = user.name;
    this.email = user.email;
    this.positionCompany = user.position_company || '';
    this.image = user.image || '';
    this.imagePreview = user.image || null;
    
    // Cargar roles seleccionados
    this.selectedRoleIds = user.roles.map(r => r.id);
    
    // Cargar solo permisos directos (no los heredados de roles)
    this.selectedPermissionIds = user.permissions
      .filter(p => !this.wasPermissionFromRole(user, p.id))
      .map(p => p.id);
    
    // Cargar empresas seleccionadas
    this.selectedEmpresaIds = user.empresas?.map(e => e.id) || [];
  }

  // Verifica si un permiso estaba heredado del rol en el usuario original (solo para carga inicial)
  wasPermissionFromRole(user: User, permissionId: number): boolean {
    return user.rolePermissions?.some(p => p.id === permissionId) || false;
  }

  loadRolesAndPermissions(): void {
    this.authorizationService.getAllRoles().subscribe({
      next: (roles: Role[]) => {
        this.allRoles = roles;
      },
      error: (error: any) => {
        console.error('Error cargando roles:', error);
        this.notificationService.showError('Error al cargar los roles');
      }
    });

    this.usersService.getAllPermissions().subscribe({
      next: (permissions: Permission[]) => {
        this.allPermissions = permissions;
      },
      error: (error: any) => {
        console.error('Error cargando permisos:', error);
        this.notificationService.showError('Error al cargar los permisos');
      }
    });

    this.empresasService.getEmpresas().subscribe({
      next: (empresas: any[]) => {
        // Mapear para usar la estructura consistente con id y nombre
        this.allEmpresas = empresas.map(e => ({
          id: e.idEmpresa,
          nombre: e.Nombre
        }));
      },
      error: (error: any) => {
        console.error('Error cargando empresas:', error);
        this.notificationService.showError('Error al cargar las empresas');
      }
    });
  }

  toggleRole(roleId: number): void {
    // Solo permitir un rol a la vez
    // Si ya está seleccionado, no hacer nada (siempre debe haber un rol)
    if (this.selectedRoleIds.includes(roleId)) {
      return;
    }
    
    // Reemplazar el rol anterior con el nuevo
    this.selectedRoleIds = [roleId];
  }

  togglePermission(permissionId: number): void {
    // No permitir desmarcar permisos heredados de roles
    if (this.isPermissionFromRole(permissionId)) {
      return;
    }
    
    const index = this.selectedPermissionIds.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissionIds.splice(index, 1);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }
  }

  toggleEmpresa(empresaId: number): void {
    const index = this.selectedEmpresaIds.indexOf(empresaId);
    if (index > -1) {
      this.selectedEmpresaIds.splice(index, 1);
    } else {
      this.selectedEmpresaIds.push(empresaId);
    }
  }

  hasRole(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  hasPermission(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  hasEmpresa(empresaId: number): boolean {
    return this.selectedEmpresaIds.includes(empresaId);
  }

  // Verifica si el permiso está heredado de alguno de los roles ACTUALMENTE seleccionados
  isPermissionFromRole(permissionId: number): boolean {
    return this.selectedRoleIds.some(roleId => {
      const role = this.allRoles.find(r => r.id === roleId);
      return role?.permissions?.some(p => p.id === permissionId) || false;
    });
  }

  // Verifica si el permiso debe estar marcado (directo o heredado)
  isPermissionChecked(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(permissionId) || this.isPermissionFromRole(permissionId);
  }

  // Cuenta cuántos permisos adicionales están seleccionados (solo los que NO vienen del rol)
  getSelectedAdditionalPermissionsCount(): number {
    return this.selectedPermissionIds.length;
  }

  // Nuevo método para manejar el evento fileSelected del componente change-image
  onImageFileSelected(selected: boolean): void {
    // Este método es llamado cuando se selecciona/deselecciona un archivo
    // Puedes usar esto para mostrar/ocultar botones o hacer validaciones
  }

  // Nuevo método para manejar el upload del componente change-image
  handleUpload(file: File): void {
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        this.notificationService.showError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.notificationService.showError('La imagen no debe superar los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.image = e.target.result; // Base64 string
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    const basicValidation = 
      this.name.trim() !== '' &&
      this.email.trim() !== '' &&
      this.isValidEmail(this.email) &&
      this.selectedRoleIds.length > 0 &&
      this.selectedEmpresaIds.length > 0; // Al menos una empresa es obligatoria

    // Si es modo creación, la contraseña es obligatoria
    if (!this.isEditMode) {
      return basicValidation &&
        this.password.trim() !== '' &&
        this.password.length >= 6 &&
        this.password === this.confirmPassword;
    }

    // Si es modo edición y NO se quiere cambiar contraseña
    if (!this.changePassword) {
      return basicValidation;
    }

    // Si es modo edición y SÍ se quiere cambiar contraseña
    return basicValidation &&
      this.password.trim() !== '' &&
      this.password.length >= 6 &&
      this.password === this.confirmPassword;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  passwordsMatch(): boolean {
    if (this.isEditMode && !this.changePassword) return true;
    return this.password === this.confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    // Validación específica de empresas
    if (this.selectedEmpresaIds.length === 0) {
      this.notificationService.showWarning('Debe seleccionar al menos una empresa para el usuario');
      return;
    }

    if (!this.isFormValid()) {
      this.notificationService.showError('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    // Encriptar la contraseña con MD5
    const hashedPassword = Md5.hashStr(this.password);

    const userData = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: hashedPassword,
      position_company: this.positionCompany.trim() || null,
      image: this.image || null,
      roleIds: this.selectedRoleIds,
      permissionIds: this.selectedPermissionIds,
      empresaIds: this.selectedEmpresaIds
    };

    this.usersService.createUser(userData).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Usuario creado exitosamente');
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        console.error('Error creando usuario:', error);
        const errorMessage = error?.error?.message || 'Error al crear el usuario';
        this.notificationService.showError(errorMessage);
        this.loading = false;
      }
    });
  }

  updateUser(): void {
    const userData: any = {
      id: this.userId,
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      position_company: this.positionCompany.trim() || null,
      image: this.image || null,
      roleIds: this.selectedRoleIds,
      permissionIds: this.selectedPermissionIds,
      empresaIds: this.selectedEmpresaIds
    };

    // Solo incluir password si se cambió
    if (this.changePassword && this.password) {
      userData.password = Md5.hashStr(this.password);
    }

    this.usersService.updateUser(userData).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Usuario actualizado exitosamente');
        this.dialogRef.close(response);
      },
      error: (error: any) => {
        console.error('Error actualizando usuario:', error);
        const errorMessage = error?.error?.message || 'Error al actualizar el usuario';
        this.notificationService.showError(errorMessage);
        this.loading = false;
      }
    });
  }

  getDialogTitle(): string {
    return this.isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Guardar cambios' : 'Crear Usuario';
  }
}
