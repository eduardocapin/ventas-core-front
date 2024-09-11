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
import { FilterService } from 'src/app/services/filter/filter.service';
import { ClientContactListComponent } from './client-contact-list/client-contact-list.component';
import { ToastrService } from 'ngx-toastr';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

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
  dataSource: { data: IClient[] } = { data: [] };
  clientsList: IClient[] = [];
  cargando: boolean = false;
  selection = new SelectionModel<IClient>(true, []);

  sortColumn: string = '';
  sortDirection: string = 'asc';

  constructor(

    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _clientsServices: ClientsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Assign the data to the data source for the table to render
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


  filteredPoblacion?: Observable<string[]>;
  clientesVentasList: IClientSales[] = [];

  familiaList: string[] = [];
  agenteList: IFiltroAgente[] = [{id: 0,name: 'FELIPE GARCILASO RIBERA'}, {id: 1,name: 'GUSTAVO BLANCO MORENO'}, {id: 2,name: 'FMERCEDES MUÑIZ ALONSO'},{id: 4,name: 'MIRIAM ALVAREZ MAS'}];
  poblacionList: string[] = ['ALALPARDO','ALCALA DE HENARES','ALCOBENDAS','ALCORCON','ALDEA SANTILLANA','ALGETE','ARANDA DE DUERO','ARAVACA','ARGANDA DEL REY','ARROYOMOLINOS','AVILA','BELVIS DEL JARAMA','BOADILLA DEL MONTE','BOECILLO','CAMARMA DE ESTERUELAS','CAMBEO','CAMPOREAL','CERCEDA','CIEMPOZUELOS','CIFUENTES','COBEÑA','COBISA','COLLADO VILLALBA','COLMENAR DE OREJA','COLMENAR VIEJO','COMENAR VIEJO','COSLADA','DAGANZO','DON BENITO','EL CASAR','EL MOLAR','EL PLANTIO','EL TIEMBLO','EL VELLON','ESTREMERA','FUENLABRADA','FUENTE EL FRESNO','FUENTE EL SAZ','FUENTE EL SAZ DE JARAMA','FUENTE EL SAZ DEL JARAMA','GALAPAGAR','GETAFE','GUADALAJARA','GUADALIX DE LA SIERRA','GUADARRAMA','ISLA DE LA TOJA','LA CABRERA','LA VALL D´UIXO','LAS ROZAS','LEGANES','LOECHES','LOS HUEROS - VILLALBILLA','LOZOYUELA','MADRID','MAJADAHONDA','MAJADAHONDA','MANGIRON-PUENTES VIEJAS','MANZANARES DEL REAL','MANZANARES EL REAL','MATALPINO','MONDEJAR','MORALZARZAL','NAVACERRADA','NAVAGALAMELLA','NAVALAFUENTE','NULES','OLIAS DEL REY','ONDA','OTERO DE HERREROS','PELAYOS DE LA PRESA','PEZUELA DE LAS TORRES','PIOZ','POZOAMARGO','POZUELO DE ALARCON','RIVAS VACIAMADRID','ROA','S.S.REYES','SAN AGUSTIN DE GUADALIX','SAN FERNANDO DE HENARES','SAN MARTIN DE LA VEGA','SAN RAFAEL','SAN SEBASTIAN  DE LOS REYES','SANTOS DE LA HUMOSA','SESEÑA','SEVILLA LA NUEVA','SIGUENZA','SOTO DEL REAL','TOLEDO','TORREJON DE ARDOZ','TORRELAGUNA','TORREMOCHA DE JARAMA','TRES CANTOS','VALDETORRES DEL JARAMA','VALL DE UXO','VILLANUEVA DE ALCARDETE','VILLENA','ZARAGOZA','ZARZALEJO'];
  provinciaList: string[] = ['ALICANTE','AVILA','BADAJOZ','BURGOS','CANTABRIA','CASTELLON','CUENCA','GUADALAJARA','MADRID','ORENSE','PONTEVEDRA','SEGOVIA','TOLEDO','VALLADOLID','ZARAGOZA'];
  s1: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'A  (> 5.000 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'B  (Entre 2.500 - 4.999 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'C  (Entre 1.000 y 2.499 €/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'D ( < 1.000 euros) ',name: 'Potenciabilidad'}];
  s2: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'Bar/Tapas  (No especializado)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Cerveceria / Cafeteria  (Especializado)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restaurante Independiente (Incluye catering)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Noche (Disco, Pubs, Bar de copas) ',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restauracion organizada: Franquicias, Tematicos',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Hoteles, Hostales, posadas',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'OCIO (Deporte,Cines,Teatro,Salon Juegos,..)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Colectividades:comedor empresa, Enseñanza,Admin,',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Tienda Alimentacion Minorista(Super,China,Panad..)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Tienda Impulso(F Secos,Chuches,Estanco,Vending',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Mayoristas (Distribuidores, Cash, por mayor)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restauracion en Ruta(aeropuerto,E.S. Carreteras)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Personal Empresa / Autoconsumo',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Alquiler',name: 'Tipologia'}];
  s3: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'Tradicional',name: 'Imagen'},{segmentation_value_id: 12,segmentation_value: 'Moderna',name: 'Imagen'},{segmentation_value_id: 12,segmentation_value: 'Emblemática',name: 'Imagen'}];
 
  ngOnInit(): void {
    this.cargando = true;
    this.loadGoogleMapsScript().then(() => {
      this._clientsServices
        .getClients()
        .pipe(timeout(20000))
        .subscribe(
          (data: any) => {
            const clientsData: any[] = data;
            this.dataSource.data = clientsData;
            this.clientsList = this.dataSource.data;
            // Forzar la detección de cambios
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

  applyComplexFilter() {
    let auxList: IClient[] = this.clientsList;
    let auxSalesList: IClientSales[];
    // Aplicamos el filtro de fecha
    if (this.range.value.start) {
      let inicial = this.range.value.start;
      auxSalesList = this.findClientesVentasFromDate(inicial);
      auxList = auxList.filter(cliente => this.isClientInClientSalesList(cliente, auxSalesList));
    }

    if (this.range.value.end) {
      let final = this.range.value.end;
      auxSalesList = this.findClientesVentasToDate(final);
      auxList = auxList.filter(cliente => this.isClientInClientSalesList(cliente, auxSalesList));
    }

    // Aplicamos el filtro Segmentacion 1
    if (this.form.value.segmentacion1FilterControl?.length) {
      auxList = auxList.filter(cliente => 
        this.form.value.segmentacion1FilterControl.includes(cliente.segmentation_1)
      );
    }
    // Aplicamos el filtro Segmentacion 2
    if (this.form.value.segmentacion2FilterControl?.length) {
      auxList = auxList.filter(cliente => 
        this.form.value.segmentacion2FilterControl.includes(cliente.segmentation_2)
      );
    }
    // Aplicamos el filtro Segmentacion 3
    if (this.form.value.segmentacion3FilterControl?.length) {
      auxList = auxList.filter(cliente => 
        this.form.value.segmentacion3FilterControl.includes(cliente.segmentation_3)
      );
    }
    // Aplicamos el filtro nombre cliente
    if (this.form.value.cliente) {
      auxList = auxList.filter(cliente => 
        cliente.name?.toLowerCase().includes(this.form.value.cliente.toLowerCase())
      );
    }
    // Aplicamos el filtro poblacion
    if (this.form.value.poblacionFilterControl?.length) {
      auxList = auxList.filter(cliente => 
        this.form.value.poblacionFilterControl.includes(cliente.city)
      );
    }
    // Aplicamos el filtro provincia
    if (this.form.value.provinciaFilterControl?.length) {
      auxList = auxList.filter(cliente => 
        this.form.value.provinciaFilterControl.includes(cliente.province)
      );
    }
    // Aplicamos el filtro vendedor
    if (this.form.value.agenteFilterControl?.length) {
      let agentes = this.form.value.agenteFilterControl;
      auxSalesList = this.findClientesVentasWithAgents(agentes);
      auxList = auxList.filter(cliente => this.isClientInClientSalesList(cliente, auxSalesList));
    }
    // Aplicamos el filtro familia
    if (this.form.value.familiaFilterControl?.length) {
      let familias = this.form.value.familiaFilterControl;
      auxSalesList = this.findClientesVentasWithFamilies(familias);
      auxList = auxList.filter(cliente => this.isClientInClientSalesList(cliente, auxSalesList));
    }

    this.dataSource.data = auxList;

  }

  filtroReset() {
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
        this.toastr.warning(
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

}
