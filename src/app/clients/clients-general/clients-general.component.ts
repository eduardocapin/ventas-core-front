import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { IClient } from 'src/app/models/clients.model';
import { PopupClientDetailComponent } from './popup-client-detail/popup-client-detail.component';
import { PopupMapClientsComponent } from './popup-map-clients/popup-map-clients.component';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { timeout } from 'rxjs';
import { ClientContactListComponent } from './client-contact-list/client-contact-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients-general',
  templateUrl: './clients-general.component.html',
  styleUrls: ['./clients-general.component.css'],
})
export class ClientsGeneralComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'checkbox',
    'customer_ERP_id',
    'name',
    'province',
    'city',
    'pc',
    'address',
    'acciones',
  ];
  dataSource: { data: IClient[] } = { data: [] };
  paginatedData: IClient[] = []; // Datos que se muestran en la página actual
  currentPage = 1;
  itemsPerPage = 10;
  clientsList: IClient[] = [];
  cargando: boolean = false;
  selection = new SelectionModel<IClient>(true, []);
  filtrosAplicados: Array<{ nombre: string; valor: any }> = [];
  sortColumn: string = '';
  sortDirection: string = 'asc';
  searchTerm: string = '';

  constructor(
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _clientsServices: ClientsService,
    private toastr: ToastrService
  ) {}

  selectedFilters: { [key: string]: any } = {};

  ngOnInit(): void {
    this.cargando = true;
    this.loadGoogleMapsScript().then(() => {
      this.loadData();
    });
  }

  private loadData() {
    this.cargando = true;
    this._clientsServices
      .getClients(this.selectedFilters,this.searchTerm)
      .pipe(timeout(20000))
      .subscribe(
        (data: any) => {
          const clientsData: any[] = data;
          this.dataSource.data = clientsData;
          this.clientsList = this.dataSource.data;
          this.paginate();
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

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.dataSource.data.slice(start, end);
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

  private loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBcREBnuBayqza1v1W2JbUGJqB0W77mcjI`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (error: any) => reject(error);
        document.head.appendChild(script);
      } else {
        resolve();
      }
    });
  }

  ngAfterViewInit() {}

  editClient(id_Cliente?: number) {
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      //width: '900px',
      disableClose: false,
      data: { id: id_Cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.editado) {
        console.log(`Actualizar fila id:${data.id}`);
      }
    });
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.dataSource.data.sort((a, b) => {
      const valueA = a[this.sortColumn as keyof IClient];
      const valueB = b[this.sortColumn as keyof IClient];

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
    this.currentPage = 1;
    this.paginate();
  }

  editContact(id_Cliente?: number) {
    const dialogRef = this.dialog.open(ClientContactListComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id_Cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log('The dialog was closed');
    });
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => {
        if (
          row.latitude &&
          row.longitude &&
          row.latitude != 0 &&
          row.longitude != 0
        ) {
          this.selection.select(row);
        }
      });
    }
  }

  isAllSelected() {
    const numRows = this.dataSource.data.filter(
      (row) =>
        row.latitude && row.longitude && row.latitude != 0 && row.longitude != 0
    ).length;
    const numSelected = this.selection.selected.length;
    return numRows === numSelected;
  }

  isCheckboxDisabled(row: any): boolean {
    return (
      !row.latitude ||
      !row.longitude ||
      (row.latitude == 0 && row.longitude == 0)
    );
  }

  //Método para ver el popup del mapa
  verEnMapa() {
    if (
      this.selection.selected.length > 0 &&
      this.selection.selected.length < 200
    ) {
      const dialogRef = this.dialog.open(PopupMapClientsComponent, {
        width: '80%',
        height: '80%',
        disableClose: true,
        data: {
          clients: this.selection.selected,
        },
      });
    } else {
      if (this.selection.selected.length <= 0) {
        this.toastr.warning(
          'Por favor, seleccione al menos 1 cliente para ver en el mapa.',
          'Seleccionar cliente'
        );
      } else if (this.selection.selected.length > 200) {
        this.toastr.error(
          'Se han seleccionado ' + this.selection.selected.length + ' clientes',
          'Límite superado (200 clientes)'
        );
      }
    }
  }
  /* para filtrar las opciones de filtrar */
  onFiltersChanged(selectedFilters: { [key: string]: any }) {
    console.log('Filtros seleccionados:', selectedFilters);
    this.selectedFilters = selectedFilters;
    this.loadData();
  }

  buscar() {
    this.loadData();
  }

  onSearchTermChange() {
    if (this.searchTerm === '') {
      this.buscar();
    }
  }
}
