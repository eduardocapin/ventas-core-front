import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { timeout } from 'rxjs';
import { MotivoRechazoService } from 'src/app/services/reasons_rejection/motivo-rechazo.service';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reasons-rejections',
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

  paginatedData: IMotivoRechazo[] =[];
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private _motivoRechazoService: MotivoRechazoService,
    private router: Router,
    public dialogRef: MatDialogRef<ReasonsRejectionsComponent>,
    public dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargaRechazos();
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
          console.log(this.rejectList)
        },
        (error) => {
          console.error('Error al cargar los motivos de rechazo', error);
          this.cargando = false;
        }
      );
  }
  /* insertar nuevo motivo de rechazo */
  insertReason() {
    if (this.newRejectionCode && this.newRejectionName) {
      const newReason = {
        rejection_code: this.newRejectionCode,
        name: this.newRejectionName
      };
  
      this._motivoRechazoService.insertReason(newReason).subscribe(
        (status) => {
          if (status === 'Success') {
            this.toastr.success('Motivo de rechazo añadido con éxito');
            this.cargaRechazos();  // Volver a cargar la lista
            this.clearNewRechazo();  // Limpiar los campos
          }
        },
        (error) => {
          console.error('Error al añadir el motivo de rechazo', error);
          this.toastr.error('Error al añadir el motivo de rechazo', 'Error');
        }
      );
    } else {
      // Aquí mostramos el error
      this.toastr.error('Por favor complete todos los campos.', 'Error');
    }
  }
  /* editar un motivo de rechazo */
  toogleEdit(reasonId: number){
    const reason = this.rejectList.find(r => r.id === reasonId);
    if(reason){
      this.originalReason = {...reason};
      this.editingReasonId = reasonId;
    }
  }
  saveChanges(reason: IMotivoRechazo) {
    // Validamos si hay cambios en los campos
    if (reason.rejection_code && reason.name) {
      this._motivoRechazoService.updateReason(reason).subscribe(
        (status) => {
          if (status === 'Success') {
            this.toastr.success('Motivo de rechazo actualizado con éxito');
            this.cargaRechazos();  // Recargar la lista de motivos
            this.editingReasonId = null;  // Salir del modo de edición
            this.originalReason = null;  // Limpiar la referencia del original
          }
        },
        (error) => {
          console.error('Error al actualizar el motivo de rechazo', error);
          this.toastr.error('Error al actualizar el motivo de rechazo', 'Error');
          // Restaurar el estado original si hay un error
          this.cancelEdit();
        }
      );
    } else {
      this.toastr.error('Por favor complete todos los campos.', 'Error');
    }
  }
  

  cancelEdit(){
    if (this.originalReason) {
      const index = this.rejectList.findIndex(r => r.id === this.originalReason!.id);
      if (index !== -1) {
        this.rejectList[index] = { ...this.originalReason };
      }
    }
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
            if (data === 'Success') {
              this.cargaRechazos();
              this.mensajeExito();
            }
          });
        }
      });
  }

  mensajeExito() {
    this.toastr.success('Motivo eliminado con exito', '', {
      timeOut: 2000,
    });
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
    this.paginate()
  }
  /* logica de btn de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }

}
