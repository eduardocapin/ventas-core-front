import { Component, AfterViewInit, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { IClient } from 'src/app/models/clients.model';
import { PopupClientDetailComponent } from './popup-client-detail/popup-client-detail.component';
import { PopupMapClientsComponent } from './popup-map-clients/popup-map-clients.component';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { IClientSales } from 'src/app/models/clientSales.model';
import { ISegmentacion } from 'src/app/models/segmentacion.model';
import { IFiltroAgente } from 'src/app/models/filtroAgente.model';
import { Observable, timeout } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { FilterService } from 'src/app/services/filter/filter.service';
import { DateAdapter } from '@angular/material/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients-general',
  templateUrl: './clients-general.component.html',
  styleUrls: ['./clients-general.component.css']
})
export class ClientsGeneralComponent implements AfterViewInit, OnInit {
  form: any;
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
  dataSource: MatTableDataSource<IClient>;
  clientsList: IClient[] = [];
  cargando: boolean = false;
  selection = new SelectionModel<IClient>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('drawer') drawer!: MatDrawer;

  constructor(
    private dateAdapter: DateAdapter<any>,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _clientsServices: ClientsService,
    private _filterServices: FilterService,
    private fb: FormBuilder,
    private paginatorIntl: MatPaginatorIntl,
    private toastr: ToastrService
  ) {
    this.configurePaginatorLabels();
    // Assign the data to the data source for the table to render
    this.dateAdapter.setLocale('es');
    this.dataSource = new MatTableDataSource<IClient>([]);
    this.form = this.fb.group({
      cliente: [''],
      provinciaFilterControl: [''],
      segmentacion1FilterControl: [''],
      segmentacion2FilterControl: [''],
      segmentacion3FilterControl: [''],
      poblacionFilterControl: [''],
      agenteFilterControl: [],
      familiaFilterControl: [],
    });
  }
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  poblacionList: string[] = [];
  filteredPoblacion?: Observable<string[]>;
  provinciaList: string[] = [];
  s1: ISegmentacion[] = [];
  s2: ISegmentacion[] = [];
  s3: ISegmentacion[] = [];
  agenteList: IFiltroAgente[] = [];
  familiaList: string[] = [];
  clientesVentasList: IClientSales[] = [];

  ngOnInit(): void {
    this.cargando = true;
    this.loadGoogleMapsScript().then(() => {
      this._clientsServices
        .getClients()
        .pipe(timeout(20000))
        .subscribe(
          (data: any) => {
            const clientsData: any[] = data.data;
            this.dataSource.data = clientsData;
            this.clientsList = this.dataSource.data;
            // Forzar la detección de cambios
            // Carga filtro poblacion
            this._filterServices.getPoblaciones().subscribe(
              (data) => {
                data.forEach((p) => this.poblacionList.push(p.name));
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );

            //Checkbox

            // Carga filtro provincia
            this._filterServices.getProvincias().subscribe(
              (data) => {
                data.forEach((p) => this.provinciaList.push(p.name));
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga filtro segmentacion 1
            /*
            this._filterServices.getSegmentacion1().subscribe(
              (data) => {
                this.s1 = data;
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga filtro segmentacion 2
            this._filterServices.getSegmentacion2().subscribe(
              (data) => {
                this.s2 = data;
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga filtro segmentacion 3
            this._filterServices.getSegmentacion3().subscribe(
              (data) => {
                this.s3 = data;
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga filtro vendedores
            this._filterServices.getAgentes().subscribe(
              (data) => {
                this.agenteList = data;
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga filtro Familias
            this._filterServices.getFamilias().subscribe(
              (data) => {
                data.forEach((f) => this.familiaList.push(f.family));
              },
              (error) => {
                console.error('Error al asignar el dataSource:', error);
              }
            );
            // Carga pedidos y qué cliente los hizo
            this._filterServices.getClientesVentas().subscribe(
              (data) => {
                this.clientesVentasList = data;
              },
              (error) => {
                console.error('Error al cargar clientesVentas:', error);
              }
            );
            */
            this.cdr.detectChanges();
            this.cargando = false;
          },
          (error) => {
            console.error('Error al asignar el dataSource:', error);
            this.cargando = false;
          }
        );
    });
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editClient(id_Cliente?: number) {
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      width: '900px',
      disableClose: true,
      data: { id: id_Cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.editado) {
        console.log(`Actualizar fila id:${data.id}`);
        
      }
    });
  }

  editContact(id_Cliente?: number) {
    /*
    const dialogRef = this.dialog.open(ClientContactListComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id_Cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log('The dialog was closed');
    });
    */
  }

  applyComplexFilter() {
    let auxList: IClient[] = this.clientsList;
    let auxSalesList: IClientSales[];
    // Aplicamos el filtro de fecha
    if (this.range.value.start) {
      let inicial = this.range.value.start;
      auxSalesList = this.findClientesVentasFromDate(inicial);
      let auxListp: IClient[] = [];
      if (auxSalesList.length > 0) {
        auxList.filter((cliente) => {
          if (this.isClientInClientSalesList(cliente, auxSalesList)) {
            auxListp.push(cliente);
          }
        });
      }
      auxList = auxListp;
    }

    if (this.range.value.end) {
      let final = this.range.value.end;
      auxSalesList = this.findClientesVentasToDate(final);
      let auxListp: IClient[] = [];
      if (auxSalesList.length > 0) {
        auxList.filter((cliente) => {
          if (this.isClientInClientSalesList(cliente, auxSalesList)) {
            auxListp.push(cliente);
          }
        });
      }
      auxList = auxListp;
    }

    // Aplicamos el filtro Segmentacion 1
    if (
      this.form.value.segmentacion1FilterControl != null &&
      this.form.value.segmentacion1FilterControl.length > 0
    ) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.segmentacion1FilterControl);
      auxList.filter((cliente) => {
        if (
          this.form.value.segmentacion1FilterControl.indexOf(
            cliente.segmentation_1
          ) !== -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro Segmentacion 2
    if (
      this.form.value.segmentacion2FilterControl != null &&
      this.form.value.segmentacion2FilterControl.length > 0
    ) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.segmentacion2FilterControl);
      auxList.filter((cliente) => {
        if (
          this.form.value.segmentacion2FilterControl.indexOf(
            cliente.segmentation_2
          ) !== -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro Segmentacion 3
    if (
      this.form.value.segmentacion3FilterControl != null &&
      this.form.value.segmentacion3FilterControl.length > 0
    ) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.segmentacion3FilterControl);
      console.log(auxList);
      auxList.filter((cliente) => {
        console.log(cliente.segmentation_3);
        if (
          this.form.value.segmentacion3FilterControl.indexOf(
            cliente.segmentation_3
          ) !== -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro nombre cliente
    if (this.form.value.cliente) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.cliente);
      auxList.filter((cliente) => {
        if (
          cliente.name
            ?.toLowerCase()
            .indexOf(this.form.value.cliente.toLowerCase()) !== -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro poblacion
    if (
      this.form.value.poblacionFilterControl != null &&
      this.form.value.poblacionFilterControl.length > 0
    ) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.poblacionFilterControl);
      auxList.filter((cliente) => {
        if (
          this.form.value.poblacionFilterControl.indexOf(cliente.city) !== -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro provincia
    if (
      this.form.value.provinciaFilterControl != null &&
      this.form.value.provinciaFilterControl.length > 0
    ) {
      let auxListp: IClient[] = [];
      console.log(this.form.value.provinciaFilterControl);
      auxList.filter((cliente) => {
        if (
          this.form.value.provinciaFilterControl.indexOf(cliente.province) !==
          -1
        ) {
          auxListp.push(cliente);
        }
      });
      auxList = auxListp;
    }
    // Aplicamos el filtro vendedor
    if (
      this.form.value.agenteFilterControl != null &&
      this.form.value.agenteFilterControl.length > 0
    ) {
      let agentes = this.form.value.agenteFilterControl;
      console.log(agentes);
      auxSalesList = this.findClientesVentasWithAgents(agentes);
      let auxListp: IClient[] = [];
      if (auxSalesList.length > 0) {
        auxList.filter((cliente) => {
          if (this.isClientInClientSalesList(cliente, auxSalesList)) {
            auxListp.push(cliente);
          }
        });
      }
      auxList = auxListp;
    }
    // Aplicamos el filtro familia
    if (
      this.form.value.familiaFilterControl != null &&
      this.form.value.familiaFilterControl.length > 0
    ) {
      let familias = this.form.value.familiaFilterControl;
      auxSalesList = this.findClientesVentasWithFamilies(familias);
      let auxListp: IClient[] = [];
      if (auxSalesList.length > 0) {
        auxList.filter((cliente) => {
          if (this.isClientInClientSalesList(cliente, auxSalesList)) {
            auxListp.push(cliente);
          }
        });
      }
      auxList = auxListp;
    }

    this.dataSource.data = auxList;
    this.drawer.toggle();
  }

  filtroReset() {
    this.range.reset();
    this.form.reset();
    this.applyComplexFilter();
    this.drawer.toggle();
  }

  resetFiltros() {
    this.range.reset();
    this.form.reset();
    this.applyComplexFilter();
  }

  hayFiltrosAplicados(): boolean {
    return (
      this.range.value.start ||
      this.range.value.end ||
      this.form.value.segmentacion1FilterControl?.length ||
      this.form.value.segmentacion2FilterControl?.length ||
      this.form.value.segmentacion3FilterControl?.length ||
      this.form.value.cliente ||
      this.form.value.provinciaFilterControl?.length ||
      this.form.value.poblacionFilterControl?.length ||
      this.form.value.agenteFilterControl?.length ||
      this.form.value.familiaFilterControl?.length
    );
  }

  findClientesVentasFromDate(fecha: Date) {
    let foundClientesVentas: IClientSales[] = [];
    this.clientesVentasList.forEach((clienteVenta) => {
      let fechaVenta = new Date(clienteVenta.date.substring(0, 10));
      fechaVenta.setHours(0, 0, 0, 0);
      if (fecha <= fechaVenta) {
        foundClientesVentas.push(clienteVenta);
      }
    });
    return foundClientesVentas;
  }

  findClientesVentasToDate(fecha: Date) {
    let foundClientesVentas: IClientSales[] = [];
    this.clientesVentasList.forEach((clienteVenta) => {
      let fechaVenta = new Date(clienteVenta.date.substring(0, 10));
      fechaVenta.setHours(0, 0, 0, 0);
      if (fechaVenta <= fecha) {
        foundClientesVentas.push(clienteVenta);
      }
    });
    return foundClientesVentas;
  }

  isClientInClientSalesList(cliente: IClient, clientSalesList: IClientSales[]) {
    let encontrado: boolean = false;
    for (let clienteVenta of clientSalesList) {
      if (clienteVenta.id_cliente == cliente.id) {
        encontrado = true;
        break;
      }
    }
    return encontrado;
  }

  findClientesVentasWithAgents(agentes: any) {
    let foundClientesVentas: IClientSales[] = [];
    this.clientesVentasList.forEach((clienteVenta) => {
      for (let agente of agentes) {
        if (clienteVenta.salesman_id == agente) {
          foundClientesVentas.push(clienteVenta);
          break;
        }
      }
    });
    return foundClientesVentas;
  }

  findClientesVentasWithFamilies(familias: any) {
    let foundClientesVentas: IClientSales[] = [];
    this.clientesVentasList.forEach((clienteVenta) => {
      for (let familia of familias) {
        if (clienteVenta.familia == familia) {
          foundClientesVentas.push(clienteVenta);
          break;
        }
      }
    });
    return foundClientesVentas;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row) => {
        if ((row.latitude && row.longitude) && row.latitude != 0 && row.longitude != 0  ) {
          this.selection.select(row);
        }
      });
    }
  }

  isAllSelected() {
    const numRows = this.dataSource.data.filter(
      (row) => (row.latitude && row.longitude) && row.latitude != 0 && row.longitude != 0 
    ).length;
    const numSelected = this.selection.selected.length;
    return numRows === numSelected;
  }

  isCheckboxDisabled(row: any): boolean {
    return (!row.latitude || !row.longitude) || (row.latitude == 0 && row.longitude == 0);
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
        this.toastr.info(
          'Por favor, seleccione al menos 1 cliente para ver en el mapa.',
          'Seleccionar cliente',
        );
      } else if (this.selection.selected.length > 200) {
        this.toastr.error(
          'Se han seleccionado ' +
            this.selection.selected.length +
            ' clientes', 'Límite superado (200 clientes)'
        );
      }
    }
  }
  private configurePaginatorLabels() {
    this.paginatorIntl.itemsPerPageLabel = 'Clientes por página';
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
