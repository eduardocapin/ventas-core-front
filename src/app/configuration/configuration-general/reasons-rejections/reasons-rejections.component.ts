import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddEditReasonRejectionsComponent } from './add-edit-reason-rejections/add-edit-reason-rejections.component';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';

interface IMotivoRechazo {
  id: number;
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-reasons-rejections',
  templateUrl: './reasons-rejections.component.html',
  styleUrls: ['./reasons-rejections.component.css'],
})
export class ReasonsRejectionsComponent implements AfterViewInit {
  displayedColumns: string[] = ['codigo', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<IMotivoRechazo>;
  rejectList: IMotivoRechazo[] = [
    { id: 1, codigo: '001', nombre: 'Motivo de rechazo 1' },
    { id: 2, codigo: '002', nombre: 'Motivo de rechazo 2' },
    { id: 3, codigo: '003', nombre: 'Motivo de rechazo 3' },
  ];
  cargando: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<ReasonsRejectionsComponent>,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource(this.rejectList);
  }

  ngOnInit(): void {
    this.cargaRechazos();
  }

  cargaRechazos(): void {
    this.cargando = true;
    // Simulando una carga de datos local
    setTimeout(() => {
      this.dataSource = new MatTableDataSource<IMotivoRechazo>(
        this.rejectList
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.cargando = false;
    }, 1000);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addEditRechazo(id?: number) {
    let motivoRechazo: IMotivoRechazo | undefined;
    
    if (id !== undefined) {
      motivoRechazo = this.rejectList.find(rechazo => rechazo.id === id);
    }

    const dialogRef = this.dialog.open(AddEditReasonRejectionsComponent, {
      width: '500px',
      disableClose: true,
      data: { motivoRechazo },  // Pasa el objeto completo
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargaRechazos();
        console.log();
      }
    });
  }

  deleteRechazo(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: `¿Estás seguro de eliminar este motivo de rechazo?`,
    });

    dialogRef.afterClosed().subscribe((confirmado: boolean) => {
      if (confirmado) {
        this.rejectList = this.rejectList.filter(rechazo => rechazo.id !== id);
        this.cargaRechazos();
        this.mensajeExito();
      }
    });
  }

  mensajeExito() {
    this._snackBar.open('Motivo eliminado con éxito', '', {
      duration: 2000,
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}
