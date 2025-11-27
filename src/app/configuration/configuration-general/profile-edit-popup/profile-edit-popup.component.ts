import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { LoginService } from 'src/app/services/auth/login.service';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthorizationService } from 'src/app/services/auth/authorization.service';
import { UsersService } from 'src/app/services/users/users.service';

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface Empresa {
  id: number;
  nombre: string;
}

@Component({
  selector: 'mobentis-profile-edit-popup',
  templateUrl: './profile-edit-popup.component.html',
  styleUrls: ['./profile-edit-popup.component.scss'],
})
export class ProfileEditPopupComponent {
  @Output() actualizarPerfil = new EventEmitter<boolean>();
  form: FormGroup;
  cargando: boolean = false;
  formChanges: boolean = false;
  email: string = '';
  hide1: boolean = true;
  hide2: boolean = true;
  hide3: boolean = true;
  errorChangePass: boolean = false;
  messageError: string = '';

  // Formulario de Contraseña
  passForm = this.formBuilder.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmNewPassword: ['', Validators.required],
  });

  progress = 0;
  message = '';

  img: string | null = 'assets/images/user.png'; // Imagen de usuario por defecto
  imageInfos?: Observable<any>;
  imgSelected = false;

  /// variable para mostrar el mensaje de error
  mostrarErrorInfo: boolean = false;
  mostrarErrorPassword: boolean = false;

  // Roles y permisos del usuario
  userRoles: string[] = [];
  userPermissions: Permission[] = [];
  allPermissions: Permission[] = [];
  userEmpresas: Empresa[] = [];
  permissionsExpanded: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ProfileEditPopupComponent>,
    private fb: FormBuilder,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private _loginServices: LoginService,
    private _notifactionService: NotificationService,
    private _authorizationService: AuthorizationService,
    private _usersService: UsersService
  ) {
    this.form = this.fb.group({
      usuario: [''],
      cargo: [''],
    });
  }

  ngOnInit(): void {
    this.cargando = true;
    this.loadData();
    this.cargando = false;
  }

  loadData(): void {
    this.form.patchValue({
      usuario: localStorage.getItem('user') || '',
      cargo: localStorage.getItem('cargo') || '',
    });
    this.email = localStorage.getItem('email') || '';
    this.img = localStorage.getItem('img');
    
    // Cargar roles desde localStorage
    this.userRoles = this._authorizationService.getRoles();
    
    // Cargar empresas del usuario desde el perfil
    this._usersService.getCurrentUserProfile().subscribe({
      next: (profile) => {
        this.userEmpresas = profile.empresas || [];
      },
      error: (err) => {
        console.error('Error al cargar empresas del usuario:', err);
        this.userEmpresas = [];
      }
    });
    
    // Obtener permisos del usuario actual desde el backend
    const userPermissionNames = this._authorizationService.getPermissions();
    
    
    // Cargar todos los permisos con sus descripciones
    this._usersService.getAllPermissions().subscribe({
      next: (allPermissions: Permission[]) => {
        this.allPermissions = allPermissions;
        
        
        // Filtrar solo los permisos que el usuario tiene
        // Comparamos por el campo 'name' (nombre técnico como RECHAZOS_EDICION_MOTIVOS)
        this.userPermissions = allPermissions.filter(p => {
          // Comparación exacta y case-insensitive
          const hasPermission = userPermissionNames.some(upn => 
            upn.toUpperCase() === p.name.toUpperCase()
          );
          
          if (hasPermission) {
          }
          
          return hasPermission;
        });
        
        console.log('Total permisos filtrados del usuario:', this.userPermissions.length);
        
        // Si no se encontraron permisos pero hay nombres en localStorage, mostrar advertencia
        if (this.userPermissions.length === 0 && userPermissionNames.length > 0) {
          console.warn('No se pudieron mapear los permisos. Nombres en localStorage:', userPermissionNames);
          console.warn('Nombres disponibles en backend:', allPermissions.map(p => p.name));
        }
      },
      error: (err) => {
        console.error('Error al cargar permisos desde el backend:', err);
        // Si hay error, mostrar los nombres desde localStorage como descripción
        this.userPermissions = userPermissionNames.map(name => ({
          id: 0,
          name: name,
          description: name.replace(/_/g, ' ') // Reemplazar guiones bajos por espacios
        }));
      }
    });
  }

  cancelar(): void {
    if (this.form.dirty || this.imgSelected || this.passForm.dirty) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: `Hay cambios sin guardar, ¿deseas salir sin guardar?`,
        })
        .afterClosed()
        .subscribe((confirmado: boolean) => {
          if (confirmado) {
            this.dialogRef.close();
          }
        });
    } else {
      this.dialogRef.close();
    }
  }

  hayCaracteresProhibidos(termino: string): boolean {
    const caracteresProhibidos = /["'`]/g;
    return caracteresProhibidos.test(termino);
  }

  update(): void {
    // Verifica si hay caracteres prohibidos en los campos del formulario
    if (
      this.hayCaracteresProhibidos(this.form.value.usuario) ||
      this.hayCaracteresProhibidos(this.form.value.cargo)
    ) {
      // Si se encuentran caracteres prohibidos, muestra el mensaje de error y no ejecuta la actualización
      this.mostrarErrorInfo = true;
      return; // Detiene la ejecución de la función
    }

    //si el formulario tiene cambios y no hay caracteres prohibidos, procede a actualizar
    if (this.form.dirty) {
      this._loginServices
        .updateUserInfo(this.form.value.usuario, this.form.value.cargo)
        .subscribe(
          (data) => {
            if (data === 'Success') {
              localStorage.setItem('user', this.form.value.usuario);
              localStorage.setItem('cargo', this.form.value.cargo);
              this._notifactionService.showSuccess('Información actualizada');
              console.log('Actualizado:', this.form.value);
              this.form.markAsPristine();
              this.mostrarErrorInfo = false;
            }
          },
          (error) => {
            this._notifactionService.showSuccess(
              'No se ha podido actualizar la información'
            );
          }
        );
    }
  }

  changePassword() {
    console.log('camibar');

    // Verifica si hay caracteres prohibidos en los campos de contraseña

    // Obtén los valores de los campos de contraseña y asegúrate de que sean strings
    const currentPassword = this.passForm.value.currentPassword ?? '';
    const newPassword = this.passForm.value.newPassword ?? '';
    const confirmNewPassword = this.passForm.value.confirmNewPassword ?? '';

    if (
      this.hayCaracteresProhibidos(currentPassword) ||
      this.hayCaracteresProhibidos(newPassword) ||
      this.hayCaracteresProhibidos(confirmNewPassword)
    ) {
      this.mostrarErrorPassword = true; // Muestra el error de contraseña
      return; // Detiene la ejecución de la función
    }

    if (this.passForm.valid) {
      const { currentPassword, newPassword, confirmNewPassword } =
        this.passForm.value;
      if (newPassword !== confirmNewPassword) {
        this.errorChangePass = true;
        this.messageError = 'La nueva contraseña no coincide.';
        this._notifactionService.showError(this.messageError);
      } else if (newPassword === currentPassword) {
        this.errorChangePass = true;
        this.messageError =
          'La nueva contraseña no puede ser la misma que la actual.';
        this._notifactionService.showError(this.messageError);
      } else {
        this._loginServices
          .changePassword(currentPassword!, newPassword!)
          .subscribe(
            (data) => {
              if (data.status === 'Success') {
                this.errorChangePass = false;
                this.messageError = '';
                this.passForm.patchValue({
                  currentPassword: '',
                  newPassword: '',
                  confirmNewPassword: '',
                });
                this.passForm.markAsPristine();
                this._notifactionService.showSuccess(
                  'Contraseña cambiada con éxito'
                );
              }
            },
            (error) => {
              this.errorChangePass = true;
              this.messageError = error.error.message;
              this._notifactionService.showError(this.messageError);
            }
          );
      }
    }
  }

  onFormChange(): void {
    this.formChanges = this.form.dirty;
  }

  onFileSelected(selected: boolean): void {
    this.imgSelected = selected;
  }
  handleUpload(file: File): void {
    if (file) {
      this.progress = 0;
      /*
      this._loginServices.upload(file).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event instanceof HttpResponse) {
            this.message = 'Imagen subida con éxito.';
            this.updateImg(file); // Llamamos a la función update para actualizar la imagen del usuario
          }
        },
        error: (err: any) => {
          console.log(err);
          this.progress = 0;

          this.message = err.error.message || 'No se ha podido subir la imagen.';
          this._notifactionService.showError(err.error.message || 'No se ha podido subir la imagen.')

        }
      });*/
    }
  }

  updateImg(file: File): void {
    if (file) {
      /*
      this._loginServices.updateimg(file.name).subscribe(data => {
        if (data === 'Success') {
          console.log('Imagen de perfil actualizada');
          this._notifactionService.showSuccess('Imagen de perfil actualizada')
        }
      });*/
    }
  }
}
