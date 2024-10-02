import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  Renderer2,
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
  styleUrls: ['./clients-general.component.scss'],
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

  //paginacion
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;

  //selector
  selectedClients: IClient[] = [];
  selection = new SelectionModel<IClient>(true, []);

  cargando: boolean = true;

  //filtrado
  selectedFilters: { [key: string]: any } = {};

  //ordeanacion
  sortColumn: string = '';
  sortDirection: string = 'asc';

  // Variable para manejar si el texto está truncado
  isTooltipVisible: boolean = false;
  tooltipText: string | null = null;
  searchTerm: string = '';

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private _clientsServices: ClientsService,
    private toastr: ToastrService
  ) {}

  

  ngOnInit(): void {
    this.cargando = true;
    this.loadGoogleMapsScript().then(() => {
      this.loadData();
    });
  }

  private loadData() {
    this.cargando = true;
    this._clientsServices
      .getClients(
        this.selectedFilters,
        this.searchTerm,
        this.currentPage,
        this.itemsPerPage,
        this.sortColumn,
        this.sortDirection
      )
      .pipe(timeout(20000))
      .subscribe(
        (data: any) => {
          const clientsData: any[] = data.items;
          this.dataSource.data = clientsData;
          this.totalItems = data.totalItems;
          this.cargando = false;
          this.updateSelectionFromCurrentPage();
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando = false;
        }
      );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadData();
  }

  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadData();
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
    this.currentPage = 1;
    this.loadData();
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
      this.selectedClients = [];
    } else {
      this.dataSource.data.forEach((row) => {
        if (!this.isCheckboxDisabled(row) && !this.isSelected(row)) {
          this.selection.select(row);
          this.selectedClients.push(row);
        }
      });
    }
    this.updateHeaderSelection();
  }

  isSelected(row: IClient): boolean {
    return this.selectedClients.some((client) => client.id === row.id);
  }

  onRowToggle(row: IClient): void {
    if (this.isSelected(row)) {
      this.selectedClients = this.selectedClients.filter(
        (selected) => selected.id !== row.id
      );
      this.selection.deselect(row);
    } else {
      this.selectedClients.push(row);
      this.selection.select(row);
    }
    this.updateHeaderSelection();
  }

  updateHeaderSelection() {
    const totalSelected = this.selectedClients.length;
    const totalVisible = this.dataSource.data.length;
    const allSelected =
      totalVisible > 0 &&
      this.dataSource.data.every((row) => this.isSelected(row));

    if (totalSelected === 0) {
      this.selection.clear(); // No hay filas seleccionadas
    } else {
      this.selection.clear();
      this.dataSource.data.forEach((row) => {
        if (this.isSelected(row)) {
          this.selection.select(row);
        }
      });
    }
    if (totalSelected > 0 && !allSelected) {
      this.selection.select(this.dataSource.data[0]);
    }
  }

  isAllSelected(): boolean {
    const numVisibleRows = this.dataSource.data.length;
    return (
      numVisibleRows > 0 &&
      this.dataSource.data.every(
        (row) => this.isSelected(row) || this.isCheckboxDisabled(row)
      )
    );
  }

  isCheckboxDisabled(row: any): boolean {
    return (
      !row.latitude ||
      !row.longitude ||
      (row.latitude === 0 && row.longitude === 0)
    );
  }

  private updateSelectionFromCurrentPage() {
    this.selection.clear();
    this.selectedClients.forEach((client) => {
      if (this.dataSource.data.some((row) => row.id === client.id)) {
        this.selection.select(client);
      }
    });
    this.updateHeaderSelection();
  }

  //Método para ver el popup del mapa
  verEnMapa() {
    if (this.selectedClients.length > 0 && this.selectedClients.length < 200) {
      const dialogRef = this.dialog.open(PopupMapClientsComponent, {
        width: '80%',
        height: '75%',
        data: {
          clients: this.selectedClients,
        },
      });
    } else {
      if (this.selectedClients.length <= 0) {
        this.toastr.warning(
          'Por favor, seleccione al menos 1 cliente para ver en el mapa.',
          'Seleccionar cliente'
        );
      } else if (this.selectedClients.length > 200) {
        this.toastr.error(
          'Se han seleccionado ' + this.selectedClients.length + ' clientes',
          'Límite superado (200 clientes)'
        );
      }
    }
  }
  /* para filtrar las opciones de filtrar */
  onFiltersChanged(selectedFilters: { [key: string]: any }) {
    console.log('Filtros seleccionados:', selectedFilters);
    this.selectedFilters = selectedFilters;
    this.currentPage = 1;
    this.loadData();
  }
  /* logica para que aparezca el tooltip cuando el texto es muy grande */
  isTextTruncated(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }

  applyTooltipIfTruncated(event: Event, text: string) {
    const element = event.target as HTMLElement;
    this.isTooltipVisible = this.isTextTruncated(element);

    // Solo asigna el texto del tooltip si el texto está truncado
    if (this.isTooltipVisible) {
      this.tooltipText = text;
      this.renderer.setStyle(element, 'cursor', 'pointer'); // Añade el cursor tipo pointer
    } else {
      this.tooltipText = null;
      this.renderer.removeStyle(element, 'cursor'); // Remueve el cursor tipo pointer
    }
  }

  buscar() {
    this.currentPage = 1;
    this.loadData();
  }

  onSearchTermChange() {
    if (this.searchTerm === '') {
      this.buscar();
    }
  }
}
