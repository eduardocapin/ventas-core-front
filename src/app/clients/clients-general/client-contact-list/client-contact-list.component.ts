import { ChangeDetectorRef, Component, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Contact } from 'src/app/models/clientContact.model';
import { ClientContactService } from 'src/app/services/clients/client-contact/client-contact.service';
import { ClientsContactComponent } from '../clients-contact/clients-contact.component';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-client-contact-list',
  templateUrl: './client-contact-list.component.html',
  styleUrls: ['./client-contact-list.component.scss'],
})
export class ClientContactListComponent {
  displayedColumns: string[] = [
    'nombre',
    'telefono_1',
    'telefono_2',
    'email',
    'acciones',
  ];
  dataSource: MatTableDataSource<Contact>;
  clientsList: Contact[] = [];
  id_cliente: number = 0;
  cargando: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialogRef: MatDialogRef<ClientContactListComponent>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _clientContactServices: ClientContactService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.configurePaginatorLabels();
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource<Contact>([]);
    this.id_cliente = data.id;
  }
  ngOnInit(): void {
    this.cargando = true;
    this._clientContactServices
      .getContacts(this.id_cliente)
      .pipe(timeout(20000))
      .subscribe(
        (data: Contact[]) => {
          console.log(data)
          this.dataSource.data = data;
          // Forzar la detección de cambios
          this.cdr.detectChanges();
          this.cargando = false;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando = false;
        }
      );
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

  cancelar() {
    this.dialogRef.close();
  }

  editContact(id_contacto?: number) {
    const dialogRef = this.dialog.open(ClientsContactComponent, {
      width: '700px',
      disableClose: true,
      data: { id: id_contacto },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.editado) {
        console.log(`Actualizar fila id:${data.id}`);
      }
    });
  }

  private configurePaginatorLabels() {
    this.paginatorIntl.itemsPerPageLabel = 'Contactos por página';
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
