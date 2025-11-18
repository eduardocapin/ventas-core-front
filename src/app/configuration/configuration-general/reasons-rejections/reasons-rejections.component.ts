import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { timeout } from 'rxjs';
import { MotivoRechazoService } from 'src/app/services/reasons_rejection/motivo-rechazo.service';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { AuthorizationService } from 'src/app/services/auth/authorization.service';

@Component({
  selector: 'mobentis-reasons-rejections',
  templateUrl: './reasons-rejections.component.html',
  styleUrls: ['./reasons-rejections.component.scss'],
})
export class ReasonsRejectionsComponent {
  rejectList: IMotivoRechazo[] = [];
  cargando: boolean = false;

  editingReasonId: number | null = null;
  originalReason: IMotivoRechazo | null = null;

  newRejectionCode: string = '';
  newRejectionName: string = '';
  
  // Variables de control de error para cada campo
  showNewCodeError: boolean = false;
  showNewNameError: boolean = false;
  showEditCodeError: boolean = false;
  showEditNameError: boolean = false;

  paginatedData: IMotivoRechazo[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  // Permisos
  isAdmin: boolean = false;
  canDeleteReasons: boolean = false;
  canCreateReasons: boolean = false;

  constructor(
    private _motivoRechazoService: MotivoRechazoService,
    public dialogRef: MatDialogRef<ReasonsRejectionsComponent>,
    public dialog: MatDialog,
    private _notifactionService: NotificationService,
    private _authorizationService: AuthorizationService,
    @Inject(MAT_DIALOG_DATA) public data: { autoClose: boolean }
  ) {
  }

  ngOnInit(): void {
    this.checkUserPermissions();
    this.cargaRechazos();
  }

  checkUserPermissions(): void {
    const userRoles = this._authorizationService.getRoles();
    const userPermissions = this._authorizationService.getPermissions();
    
    // Verificar si es Admin
    this.isAdmin = userRoles.some(role => 
      role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'ADMINISTRADOR'
    );
    
    // Verificar permisos específicos
    this.canDeleteReasons = this.isAdmin || userPermissions.some(p => 
      p.toUpperCase() === 'CONFIGURACION_BORRADO_MOTIVOS'
    );
    
    this.canCreateReasons = this.isAdmin || userPermissions.some(p => 
      p.toUpperCase() === 'CONFIGURACION_CREACION_MOTIVOS'
    );
  }

  cargaRechazos(): void {
    this.cargando = true;
    this._motivoRechazoService
      .getReasons()
      .pipe(timeout(20000))
      .subscribe(
        (data: IMotivoRechazo[]) => {
          this.rejectList = data;
          this.cargando = false;
          this.paginate();
        },
        (error) => {
          console.error('Error al cargar los motivos de rechazo', error);
          this.cargando = false;
        }
      );
  }
  // Método de validación de caracteres prohibidos
  hayCaracteresProhibidos(termino: string): boolean {
    const caracteresProhibidos = /["'`]/g;
    return caracteresProhibidos.test(termino);
  }
  // Método actualizado para verificar duplicados
  reasonExists(rejection_code: string, name: string, excludeId?: number): boolean {
    return this.rejectList.some(
      (reason) =>
        (reason.rejection_code.trim().toLowerCase() === rejection_code.trim().toLowerCase() ||
         reason.name.trim().toLowerCase() === name.trim().toLowerCase()) &&
        reason.id !== excludeId
    );
  }
  /* insertar nuevo motivo de rechazo */
  insertReason() {
    // Validamos cada campo de forma independiente
    this.showNewCodeError = this.hayCaracteresProhibidos(this.newRejectionCode);
    this.showNewNameError = this.hayCaracteresProhibidos(this.newRejectionName);

     // Validación de duplicados para el código y el nombre
    if (this.reasonExists(this.newRejectionCode, this.newRejectionName)) {
      this._notifactionService.showError('Este código o nombre ya existe en los motivos de rechazo');
      return;
    }

    // Resto de la lógica de inserción de motivo
    const newReason = {
      rejection_code: this.newRejectionCode,
      name: this.newRejectionName,
    };

    this._motivoRechazoService.insertReason(newReason).subscribe(
      (data) => {
        console.log(data)
        if (data.status === 'Success') {
          this._notifactionService.showSuccess('Motivo de rechazo añadido con éxito');
          this.cargaRechazos();  
          this.clearNewRechazo();
          if (this.data.autoClose) {
            this.dialogRef.close({
              id: data.data.id,
              name: newReason.name,
            });
          }
        }
      },
      (error) => {
        console.error('Error al añadir el motivo de rechazo', error);
        this._notifactionService.showError('Error al añadir el motivo de rechazo');
      }
    );
  }
  /* editar un motivo de rechazo */
  toogleEdit(reasonId: number) {
    const reason = this.rejectList.find((r) => r.id === reasonId);
    if (reason) {
      this.originalReason = { ...reason };
      this.editingReasonId = reasonId;
    }
  }
  saveChanges(reason: IMotivoRechazo) {
    this.showEditCodeError = this.hayCaracteresProhibidos(reason.rejection_code);
    this.showEditNameError = this.hayCaracteresProhibidos(reason.name);
    //validacion de caracteres prohibidos
    if (this.showEditCodeError || this.showEditNameError) {
      // Detener la función si hay caracteres no permitidos
      return;
    }
    // Validación de duplicados para el código y el nombre, excluyendo el motivo actual
    if (this.reasonExists(reason.rejection_code, reason.name, reason.id)) {
      this._notifactionService.showError('Este código o nombre ya existe en los motivos de rechazo');
      return;
    }
    // Validamos si hay cambios en los campos
    if (reason.rejection_code && reason.name) {
      this._motivoRechazoService.updateReason(reason).subscribe(
        (status) => {
          if (status === 'Success') {
            this._notifactionService.showSuccess(
              'Motivo de rechazo actualizado con éxito'
            );
            this.cargaRechazos(); // Recargar la lista de motivos
            this.editingReasonId = null; // Salir del modo de edición
            this.originalReason = null; // Limpiar la referencia del original
          }
        },
        (error) => {
          console.error('Error al actualizar el motivo de rechazo', error);
          this._notifactionService.showError(
            'Error al actualizar el motivo de rechazo'
          );
          // Restaurar el estado original si hay un error
          this.cancelEdit();
        }
      );
    } else {
      this._notifactionService.showError(
        'Por favor complete todos los campos.'
      );
    }
  }

  cancelEdit() {
    if (this.originalReason && this.editingReasonId !== null) {
      // Encuentra el índice en los datos paginados
      const paginatedIndex = this.paginatedData.findIndex(r => r.id === this.originalReason!.id);
      
      // Si se encuentra el motivo editado, revierte los datos al original
      if (paginatedIndex !== -1) {
          this.paginatedData[paginatedIndex] = { ...this.originalReason };
      }

      // Encuentra y actualiza en la lista principal para reflejar los cambios al salir de edición
      const index = this.rejectList.findIndex(
        (r) => r.id === this.originalReason!.id
      );
      if (index !== -1) {
          this.rejectList[index] = { ...this.originalReason };
      }
    }
    
    // Restablecer la referencia y salir del modo de edición
    this.editingReasonId = null;
    this.originalReason = null;
  }

  /* Limpiar los campos del nuevo motivo de rechazo */
  clearNewRechazo() {
    this.newRejectionCode = '';
    this.newRejectionName = '';
  }
  deleteRechazo(id: Number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `¿Estas seguro de eliminar este motivo de rechazo?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this._motivoRechazoService.deleteReason(id).subscribe((data) => {
            console.log(data)
            if (data.status === 'Success') {
              this.cargaRechazos();
              this.mensajeExito();
            }
          });
        }
      });
  }

  mensajeExito() {
    this._notifactionService.showSuccess('Motivo eliminado con exito');
  }
  /* paginator */
  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.rejectList.slice(start, end);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.paginate();
  }
  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.paginate();
  }
  /* logica de btn de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }
  isButtonEnabled(): boolean {
    return this.newRejectionCode.trim() !== '' && this.newRejectionName.trim() !== '';
  }
}
