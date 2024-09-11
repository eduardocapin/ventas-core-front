import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
export class ReasonsRejectionsComponent implements AfterViewInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<IMotivoRechazo>;
  rejectList: IMotivoRechazo[] = [];
  cargando: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _motivoRechazoService: MotivoRechazoService,
    private router: Router,
    public dialogRef: MatDialogRef<ReasonsRejectionsComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.configurePaginatorLabels();

    this.dataSource = new MatTableDataSource(this.rejectList);
  }

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
          this.dataSource = new MatTableDataSource<IMotivoRechazo>(
            this.rejectList
          );
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cargando = false;
        },
        (error) => {
          // Maneja los errores adecuadamente
          console.error('Error al cargar los motivos de rechazo', error);
          this.cargando = false;
        }
      );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  /* filtrado para el filtrado */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
        console.log();
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
              console.log('delete');
              console.log(id);
              this.cargaRechazos();
              this.mensajeExito();
            }
          });
        } else {
        }
      });
  }

  mensajeExito() {
    this._snackBar.open('Motivo eliminado con exito', '', {
      duration: 2000,
    });
  }

  /* logica de btn de Cancelar de Motivo de Rechazo */
  cancelar() {
    this.dialogRef.close();
  }

  private configurePaginatorLabels() {
    this.paginatorIntl.itemsPerPageLabel = 'Motivos de rechazo por página';
    this.paginatorIntl.nextPageLabel = 'Página siguiente';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginatorIntl.changes.next();
  }
}
