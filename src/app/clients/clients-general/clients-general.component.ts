import { Component, AfterViewInit, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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


declare var bootstrap: any; 
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
  paginatedData: IClient[] = []; // Datos que se muestran en la página actual
  currentPage = 1; 
  itemsPerPage = 10; 
  totalItems = 0; 
  clientsList: IClient[] = [];
  cargando: boolean = false;
  selection = new SelectionModel<IClient>(true, []);
  filtrosAplicados: Array<{nombre: string, valor: any}> = [];
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
  s1: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'A  (> 5.000 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'B  (Entre 2.500 - 4.999 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 13,segmentation_value: 'C  (Entre 1.000 y 2.499 €/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 24,segmentation_value: 'D ( < 1.000 euros) ',name: 'Potenciabilidad'}];
  s2: ISegmentacion[] = [{segmentation_value_id: 1,segmentation_value: 'Bar/Tapas  (No especializado)',name: 'Tipologia'},{segmentation_value_id: 2,segmentation_value: 'Cerveceria / Cafeteria  (Especializado)',name: 'Tipologia'},{segmentation_value_id: 21,segmentation_value: 'Restaurante Independiente (Incluye catering)',name: 'Tipologia'},{segmentation_value_id: 3,segmentation_value: 'Noche (Disco, Pubs, Bar de copas) ',name: 'Tipologia'},{segmentation_value_id: 32,segmentation_value: 'Restauracion organizada: Franquicias, Tematicos',name: 'Tipologia'},{segmentation_value_id: 33,segmentation_value: 'Hoteles, Hostales, posadas',name: 'Tipologia'},{segmentation_value_id: 34,segmentation_value: 'OCIO (Deporte,Cines,Teatro,Salon Juegos,..)',name: 'Tipologia'},{segmentation_value_id: 35,segmentation_value: 'Colectividades:comedor empresa, Enseñanza,Admin,',name: 'Tipologia'},{segmentation_value_id: 36,segmentation_value: 'Tienda Alimentacion Minorista(Super,China,Panad..)',name: 'Tipologia'},{segmentation_value_id: 37,segmentation_value: 'Tienda Impulso(F Secos,Chuches,Estanco,Vending',name: 'Tipologia'},{segmentation_value_id: 18,segmentation_value: 'Mayoristas (Distribuidores, Cash, por mayor)',name: 'Tipologia'},{segmentation_value_id: 54,segmentation_value: 'Restauracion en Ruta(aeropuerto,E.S. Carreteras)',name: 'Tipologia'},{segmentation_value_id: 55,segmentation_value: 'Personal Empresa / Autoconsumo',name: 'Tipologia'},{segmentation_value_id: 58,segmentation_value: 'Alquiler',name: 'Tipologia'}];
  s3: ISegmentacion[] = [{segmentation_value_id: 10,segmentation_value: 'Tradicional',name: 'Imagen'},{segmentation_value_id: 22,segmentation_value: 'Moderna',name: 'Imagen'},{segmentation_value_id: 23,segmentation_value: 'Emblemática',name: 'Imagen'}];
 
  ngOnInit(): void {
    this.cargando = true;
    this.loadGoogleMapsScript().then(() => {
      this.loadData()
    });
  }

  private loadData(){
    this._clientsServices
    .getClients()
    .pipe(timeout(20000))
    .subscribe(
      (data: any) => {
        const clientsData: any[] = data;
        this.dataSource.data = clientsData;
        this.clientsList = this.dataSource.data;
        this.totalItems = this.dataSource.data.length;
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
    this.currentPage = 1
    this.paginate()
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
    this.filtrosAplicados = [];
      // Verificar si cada filtro tiene un valor aplicado y agregarlo a la lista de filtros aplicados
      if (this.form.get('cliente')?.value) {
        this.filtrosAplicados.push({ nombre: 'Cliente', valor: this.form.get('cliente')?.value });
      }
      // Convertir los valores de segmentación a los valores legibles
      this.addSegmentacionFilter('segmentacion1FilterControl', 'Potenciabilidad', this.s1);
      this.addSegmentacionFilter('segmentacion2FilterControl', 'Tipología', this.s2);
      this.addSegmentacionFilter('segmentacion3FilterControl', 'Imagen', this.s3);

      if (this.range.value.start && this.range.value.end) {
        this.filtrosAplicados.push({ nombre: 'Periodo de ventas', valor: `${this.range.value.start} - ${this.range.value.end}` });
      }

      if (this.form.get('poblacionFilterControl')?.value) {
        this.filtrosAplicados.push({ nombre: 'Población', valor: this.form.get('poblacionFilterControl')?.value });
      }

      if (this.form.get('provinciaFilterControl')?.value) {
        this.filtrosAplicados.push({ nombre: 'Provincia', valor: this.form.get('provinciaFilterControl')?.value });
      }

      if (this.form.get('agenteFilterControl')?.value) {
        this.filtrosAplicados.push({ nombre: 'Agente', valor: this.form.get('agenteFilterControl')?.value });
      }

      if (this.form.get('familiaFilterControl')?.value) {
        this.filtrosAplicados.push({ nombre: 'Familia', valor: this.form.get('familiaFilterControl')?.value });
      }

      this.applyFilterLogic();
  }
  // Método para agregar los filtros de segmentación con los valores convertidos
  private addSegmentacionFilter(controlName: string, filtroNombre: string, segmentacionList: ISegmentacion[]) {
    const selectedIds = this.form.get(controlName)?.value || [];
    const selectedValues = segmentacionList
        .filter(s => selectedIds.includes(s.segmentation_value_id))
        .map(s => s.segmentation_value);
    
    if (selectedValues.length > 0) {
        this.filtrosAplicados.push({ nombre: filtroNombre, valor: selectedValues.join(', ') });
    }
  }
  /* botin para eleiminar solo un filtro */
  removeFilter(filtro: { nombre: string, valor: any }) {
      // Eliminar el filtro de la lista de filtros aplicados
  this.filtrosAplicados = this.filtrosAplicados.filter(f => f !== filtro);

  // Restablecer el filtro en el formulario
  switch (filtro.nombre) {
    case 'Cliente':
      this.form.get('cliente')?.reset();
      break;
    case 'Potenciabilidad':
      this.form.get('segmentacion1FilterControl')?.reset();
      break;
    case 'Tipología':
      this.form.get('segmentacion2FilterControl')?.reset();
      break;
    case 'Imagen':
      this.form.get('segmentacion3FilterControl')?.reset();
      break;
    case 'Periodo de ventas':
      this.range.reset();
      break;
    case 'Población':
      this.form.get('poblacionFilterControl')?.reset();
      break;
    case 'Provincia':
      this.form.get('provinciaFilterControl')?.reset();
      break;
    case 'Agente':
      this.form.get('agenteFilterControl')?.reset();
      break;
    case 'Familia':
      this.form.get('familiaFilterControl')?.reset();
      break;
  }
  // Aplicar la lógica de filtros actualizada
  this.applyFilterLogic();
  }
  /* logica para el filtrado de segmetacion */
  onFilterSelect(segmentationValueId: number, segmentacionTipo: number) {  
    let selectedFilter;
    switch (segmentacionTipo) {
      case 1:
        selectedFilter = this.s1.find(s => s.segmentation_value_id === segmentationValueId);
        if (selectedFilter) {
          let currentSelection = this.form.get('segmentacion1FilterControl')?.value || [];
          // Verificar si el valor ya está seleccionado (si es así, lo quitamos)
          if (currentSelection.includes(segmentationValueId)) {
            currentSelection = currentSelection.filter((id: number) => id !== segmentationValueId);
          } else {
            // Si no está seleccionado, lo agregamos
            currentSelection.push(segmentationValueId);
          }
          this.form.get('segmentacion1FilterControl')?.setValue(currentSelection);
        }
        break;
      case 2:
        selectedFilter = this.s2.find(s => s.segmentation_value_id === segmentationValueId);
        if (selectedFilter) {
          let currentSelection = this.form.get('segmentacion2FilterControl')?.value || [];

          ///verifica si el valor ya esta seleccionad ( si es así, lo quitamos)
          if(currentSelection.includes(segmentationValueId)){
            currentSelection = currentSelection.filter((id:number) => id !== segmentationValueId);
          }else{
            currentSelection.push(segmentationValueId);
          }
          this.form.get('segmentacion2FilterControl')?.setValue(currentSelection);
        }
        break;
      case 3:
        selectedFilter = this.s3.find(s => s.segmentation_value_id === segmentationValueId);
        if (selectedFilter) {
          let currentSelection = this.form.get('segmentacion3FilterControl')?.value || [];

          ///verifica si el valor ya esta seleccionad ( si es así, lo quitamos)
          if(currentSelection.includes(segmentationValueId)){
            currentSelection = currentSelection.filter((id:number) => id !== segmentationValueId);
          }else{
            currentSelection.push(segmentationValueId);
          }
          this.form.get('segmentacion3FilterControl')?.setValue(currentSelection);
        }
        break;
      default:
        console.warn('Segmentación no válida');
        return;
    }
    if (selectedFilter) {
      this.applyComplexFilter(); // Aplicar los filtros después de seleccionar
    }
  }
  /* Filtros de poblacion y provincia */
  onFilterLocationSelect(filterType: string, value: string) {
    let currentSelection: string[];
  
    switch (filterType) {
      case 'Provincia':
        currentSelection = this.form.get('provinciaFilterControl')?.value || [];
        if (currentSelection.includes(value)) {
          currentSelection = currentSelection.filter(v => v !== value);
        } else {
          currentSelection.push(value);
        }
        this.form.get('provinciaFilterControl')?.setValue(currentSelection);
        break;
      case 'Población':
        currentSelection = this.form.get('poblacionFilterControl')?.value || [];
        if (currentSelection.includes(value)) {
          currentSelection = currentSelection.filter(v => v !== value);
        } else {
          currentSelection.push(value);
        }
        this.form.get('poblacionFilterControl')?.setValue(currentSelection);
        break;
      default:
        console.warn('Tipo de filtro no válido');
        return;
    }
  
    this.applyComplexFilter(); // Aplicar los filtros después de seleccionar
  }
  
  /* se pasara la logica para los filtros aqui */
  applyFilterLogic(){
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
      
      auxList = auxList.filter(cliente => {
        const segmentacion1Filters = this.form.value.segmentacion1FilterControl.map(String); // Convertir valores del filtro a cadenas 
        const isIncluded = segmentacion1Filters.includes(String(cliente.segmentation_1));
        return isIncluded;
      });
    }

    // Aplicamos el filtro Segmentacion 2
    if (this.form.value.segmentacion2FilterControl?.length) {
      
      auxList = auxList.filter(cliente => {
        const segmentacion2Filters = this.form.value.segmentacion2FilterControl.map(String); // Convertir valores del filtro a cadenas       
        const isIncluded = segmentacion2Filters.includes(String(cliente.segmentation_2));  
        return isIncluded;
      });
    }
    // Aplicamos el filtro Segmentacion 3
    if (this.form.value.segmentacion3FilterControl?.length) {
      
      auxList = auxList.filter(cliente => {
        const segmentacion3Filters = this.form.value.segmentacion3FilterControl.map(String); // Convertir valores del filtro a cadenas 
        const isIncluded = segmentacion3Filters.includes(String(cliente.segmentation_3));
        return isIncluded;
      });
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
      auxList = auxList.filter(cliente =>
        this.form.value.agenteFilterControl.includes()
      )
    }
    // Aplicamos el filtro familia
    if (this.form.value.familiaFilterControl?.length) {
      let familias = this.form.value.familiaFilterControl;
      auxSalesList = this.findClientesVentasWithFamilies(familias);
      auxList = auxList.filter(cliente => this.isClientInClientSalesList(cliente, auxSalesList));
    }

    this.dataSource.data = auxList;
    this.closeDropdown();
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
  @ViewChild('dropdownWrapper') dropdownWrapper!: ElementRef;

  // Método para cerrar el dropdown
  closeDropdown() {
    const dropdownToggle = this.dropdownWrapper.nativeElement.querySelector('.dropdown-toggle');
    const dropdown = new bootstrap.Dropdown(dropdownToggle);
    dropdown.hide();  // Cierra el dropdown de Bootstrap
  }
}
