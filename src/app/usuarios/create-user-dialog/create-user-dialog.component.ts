import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios/usuarios.service';
import { AuthorizationService } from '../../services/auth/authorization.service';
import { NotificationService } from '../../services/notification/notification.service';
import { Md5 } from 'ts-md5';

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
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})
export class CreateUserDialogComponent implements OnInit {
  // Form fields
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  positionCompany: string = '';
  image: string = '';
  selectedRoleIds: number[] = [];
  selectedPermissionIds: number[] = [];

  // Available options
  allRoles: Role[] = [];
  allPermissions: Permission[] = [];

  // UI state
  loading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  imagePreview: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private usuariosService: UsuariosService,
    private authorizationService: AuthorizationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRolesAndPermissions();
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

    this.usuariosService.getAllPermissions().subscribe({
      next: (permissions: Permission[]) => {
        this.allPermissions = permissions;
      },
      error: (error: any) => {
        console.error('Error cargando permisos:', error);
        this.notificationService.showError('Error al cargar los permisos');
      }
    });
  }

  toggleRole(roleId: number): void {
    const index = this.selectedRoleIds.indexOf(roleId);
    if (index > -1) {
      // Si es el último rol, no permitir quitarlo
      if (this.selectedRoleIds.length === 1) {
        this.notificationService.showWarning('Debe seleccionar al menos un rol');
        return;
      }
      this.selectedRoleIds.splice(index, 1);
    } else {
      this.selectedRoleIds.push(roleId);
    }
  }

  togglePermission(permissionId: number): void {
    const index = this.selectedPermissionIds.indexOf(permissionId);
    if (index > -1) {
      this.selectedPermissionIds.splice(index, 1);
    } else {
      this.selectedPermissionIds.push(permissionId);
    }
  }

  hasRole(roleId: number): boolean {
    return this.selectedRoleIds.includes(roleId);
  }

  hasPermission(permissionId: number): boolean {
    return this.selectedPermissionIds.includes(permissionId);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
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

  removeImage(): void {
    this.image = '';
    this.imagePreview = null;
  }

  isFormValid(): boolean {
    return (
      this.name.trim() !== '' &&
      this.email.trim() !== '' &&
      this.isValidEmail(this.email) &&
      this.password.trim() !== '' &&
      this.password.length >= 6 &&
      this.password === this.confirmPassword &&
      this.selectedRoleIds.length > 0
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  passwordsMatch(): boolean {
    return this.password === this.confirmPassword;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      this.notificationService.showError('Por favor completa todos los campos requeridos correctamente');
      return;
    }

    this.loading = true;

    // Encriptar la contraseña con MD5 (igual que en reset password)
    const hashedPassword = Md5.hashStr(this.password);

    const userData = {
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: hashedPassword,
      position_company: this.positionCompany.trim() || null,
      image: this.image || null,
      roleIds: this.selectedRoleIds,
      permissionIds: this.selectedPermissionIds
    };

    this.usuariosService.createUser(userData).subscribe({
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
}
