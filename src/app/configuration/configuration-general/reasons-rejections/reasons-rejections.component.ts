import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditReasonRejectionsComponent } from './add-edit-reason-rejections/add-edit-reason-rejections.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { timeout } from 'rxjs';
import { MotivoRechazoService } from 'src/app/services/reasons_rejection/motivo-rechazo.service';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';

@Component({
  selector: 'app-reasons-rejections',
  templateUrl: './reasons-rejections.component.html',
  styleUrls: ['./reasons-rejections.component.css'],
})
export class ReasonsRejectionsComponent {
  rejectList: IMotivoRechazo[] = [];
  cargando: boolean = false;

  newRejectionCode: string = '';
  newRejectionName: string = '';

  constructor(
    private _motivoRechazoService: MotivoRechazoService,
    private router: Router,
    public dialogRef: MatDialogRef<ReasonsRejectionsComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
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
        },
        (error) => {
          console.error('Error al cargar los motivos de rechazo', error);
          this.cargando = false;
        }
      );
  }

  /* editar un motivo de rechazo */
  addEditRechazo(id?: Number) {
    const dialogRef = this.dialog.open(AddEditReasonRejectionsComponent, {
      width: '500px',
      disableClose: true,
      data: { id: id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargaRechazos();
      }
    });
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
    this._snackBar.open('Motivo eliminado con exito', '', {
      duration: 2000,
    });
  }

  /* logica de btn de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }

  /* New row */
    /* Limpiar los campos del nuevo motivo de rechazo */
    clearNewRechazo() {
      this.newRejectionCode = '';
      this.newRejectionName = '';
    }
}
