import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupMapComponent } from './popup-map-rechazos/popup-map-rechazos.component';
import { IRechazo } from 'src/app/models/rechazos.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { IEstado } from 'src/app/models/estados.model';
import { ISimbolo } from 'src/app/models/simbolos.model';
import { ExportService } from 'src/app/services/export/export.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupClientDetailComponent } from 'src/app/clients/clients-general/popup-client-detail/popup-client-detail.component';
import { ICompetidor } from 'src/app/models/competidor.model';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { IProvincia } from 'src/app/models/provincias.model';
import { IPoblacion } from 'src/app/models/poblaciones.model';

@Component({
  selector: 'app-rechazos-general',

  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.scss'],
})
export class RechazosGeneralComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = [
    'select',
    'estado',
    'poblacion',
    'cliente',
    'producto',
    'tipo_rechazo',
    'precio_producto',
    'promo_propia',
    'precio_competidor',
    'promo_competidor',
    'competidor',
    'accion_correctora',
    'propuesta_agente',
    'interes',
    'expand',
  ];
  dataSource: IRechazo[] = [];
  //paginacion
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;

  cargando = true;

  //selector
  selectedRechazos: IRechazo[] = [];
  selection = new SelectionModel<IRechazo>(true, []);

  rechazoList: IRechazo[] = [];
  estados: IEstado[] = [];
  provincias: IProvincia[] = [];
  poblacion: IPoblacion[] = [];
  competidores: ICompetidor[] = [];
  motivos_rechazo: IMotivoRechazo[] = [];
  simbolos: ISimbolo[] = [];

  expandedElement?: IRechazo | null;
  selectedOption: string = 'Excel';
  filtrosAplicados: Array<{ nombre: string; valor: any }> = [];

  // Variable para manejar si el texto está truncado
  isTooltipVisible: boolean = false;
  tooltipText: string | null = null;
  selectedFilters: { [key: string]: any } = {};
  searchTerm: string = '';

  //ordeanacion
  sortColumn: string = 'r.last_rejection_date';
  sortDirection: string = 'desc';

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private rechazadosService: RechazadosService,
    private filterService: FilterService,
    private _exportService: ExportService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadRechazos();
    this.loadEstados();
    this.loadProvincias();
    this.loadSimbolos();
    this.loadGoogleMapsScript();
    this.loadCompetidores();
    this.loadTiposRechazo();
    this.loadPoblacion();
  }
  getProvincia(id: number): string {
    const provincia = this.provincias.find((c) => c.id == id);
    return provincia ? provincia.name : 'No encontrado';
  }

  getPoblacion(id: number): string {
    const poblacion = this.poblacion.find((c) => c.id == id);
    return poblacion ? poblacion.name : 'No encontrado';
  }

  private loadRechazos() {
    this.cargando = true;
    this.rechazadosService
      .getRechazos(
        this.selectedFilters,
        this.searchTerm,
        this.currentPage,
        this.itemsPerPage,
        this.sortColumn,
        this.sortDirection
      )
      .subscribe((data: any) => {
        console.log('Rechazos cargados:', data.items);
        const rechazosData: IRechazo[] = data.items;
        this.dataSource = rechazosData;
        this.totalItems = data.totalItems;
        this.cargando = false;
        this.updateSelectionFromCurrentPage();
      });
  }
  private loadProvincias() {
    this.filterService.getProvincias().subscribe((provincias: IProvincia[]) => {
      this.provincias = provincias;
    });
  }

  private loadPoblacion() {
    this.filterService.getPoblaciones().subscribe((poblacion: IPoblacion[]) => {
      this.poblacion = poblacion;
    });
  }

  private loadEstados() {
    this.filterService.getEstados().subscribe((estados: IEstado[]) => {
      this.estados = estados;
    });
  }

  private loadCompetidores() {
    this.filterService
      .getCompetidores()
      .subscribe((competidores: ICompetidor[]) => {
        this.competidores = competidores;
      });
  }

  private loadTiposRechazo() {
    this.filterService
      .getMotivosRechazo()
      .subscribe((motivos_rechazo: IMotivoRechazo[]) => {
        this.motivos_rechazo = motivos_rechazo;
      });
  }

  private loadSimbolos() {
    this.filterService.getSimbolos().subscribe((simbolos: ISimbolo[]) => {
      this.simbolos = simbolos;
    });
  }

  private loadGoogleMapsScript() {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBcREBnuBayqza1v1W2JbUGJqB0W77mcjI`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  getEstado(id: number): string {
    const estado = this.estados.find((c) => c.id == id);
    return estado ? estado.name : 'No encontrado';
  }

  ngAfterViewInit() {
    // Placeholder for further initialization if needed
  }

  getOptionImage(statusId: number): string {
    return `assets/icon/estado_${statusId}.svg`;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedRechazos = [];
    } else {
      this.dataSource.forEach((row) => {
        if (!this.isCheckboxDisabled(row) && !this.isSelected(row)) {
          this.selection.select(row);
          this.selectedRechazos.push(row);
        }
      });
    }
    this.updateHeaderSelection();
  }

  isSelected(row: IRechazo): boolean {
    return this.selectedRechazos.some((rechazo) => rechazo.id === row.id);
  }

  onRowToggle(row: IRechazo): void {
    if (this.isSelected(row)) {
      this.selectedRechazos = this.selectedRechazos.filter(
        (selected) => selected.id !== row.id
      );
      this.selection.deselect(row);
    } else {
      this.selectedRechazos.push(row);
      this.selection.select(row);
    }
    this.updateHeaderSelection();
  }

  updateHeaderSelection() {
    const totalSelected = this.selectedRechazos.length;
    const totalVisible = this.dataSource.length;
    const allSelected =
      totalVisible > 0 && this.dataSource.every((row) => this.isSelected(row));

    if (totalSelected === 0) {
      this.selection.clear(); // No hay filas seleccionadas
    } else {
      this.selection.clear();
      this.dataSource.forEach((row) => {
        if (this.isSelected(row)) {
          this.selection.select(row);
        }
      });
    }
    if (totalSelected > 0 && !allSelected) {
      this.selection.select(this.dataSource[0]);
    }
  }

  isAllSelected(): boolean {
    const numVisibleRows = this.dataSource.length;
    return (
      numVisibleRows > 0 &&
      this.dataSource.every(
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
    this.selectedRechazos.forEach((rehazo) => {
      if (this.dataSource.some((row) => row.id === rehazo.id)) {
        this.selection.select(rehazo);
      }
    });
    this.updateHeaderSelection();
  }

  verEnMapa() {
    if (this.selectedRechazos.length === 0) {
      this.toastr.warning(
        'Debe seleccionar al menos 1 rechazo antes de ver en el mapa.',
        'Advertencia'
      );
      return;
    }

    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '80%',
      height: '75%',
      data: { selectedRows: this.selectedRechazos },
    });
  }

  /* popup-rechazo-detail */
  viewRechazo(id_Cliente?: any) {
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id_Cliente },
    });
  }

  actualizarEstados(row: IRechazo) {
    console.log(row);
    const estadoSeleccionado = this.estados.find(
      (estado) => estado.id == row.status_id
    );

    if (estadoSeleccionado) {
      const idEstadoSeleccionado = estadoSeleccionado.id;
      console.log('ID de Rechazo seleccionado:', row.id);
      console.log('ID de Estado seleccionado:', idEstadoSeleccionado);
    } else {
      console.error(
        'No se encontró el ID del estado seleccionado en el array estados'
      );
    }
  }

  updateSymbol(row: IRechazo & { tempSimboloPromocion?: number }) {
    if (row.tempSimboloPromocion != null) {
      row.corrective_action_symbol_id = row.tempSimboloPromocion;
      console.log('Símbolo actualizado:', row.corrective_action_symbol_id);

      this.rechazadosService
        .actualizarPrecioSimboloPromocion(
          row.id,
          row.tempSimboloPromocion,
          row.tempSimboloPromocion
        )
        .subscribe(
          (response) => {
            this.toastr.success('Símbolo actualizado correctamente.', '', {});
          },
          (error) => {
            this.toastr.error('Error al actualizar el símbolo.', '', {});
            console.error('Error al actualizar el símbolo:', error);
          }
        );
    }
  }

  exportar_rechazos() {
    if (this.selectedRechazos.length <= 0) {
      return;
    }
    if (this.selectedOption == '') {
      return;
    }
    this.exportData();
  }

  exportData(): void {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[-T:]/g, '-');

    const fileName = `exportacion_rechazos_${timestamp}`;

    if (this.selectedOption === 'Excel') {
      this._exportService.exportToExcel(this.selectedRechazos, fileName);
    } else if (this.selectedOption === 'CSV') {
      this._exportService.exportToCSV(this.selectedRechazos, fileName);
    } else if (this.selectedOption === 'Json') {
      this._exportService.exportToJson(this.selectedRechazos, fileName);
    }
  }

  updateOption(option: string) {
    this.selectedOption = option;
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.loadRechazos();
  }

  changeMotivo(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newReasonId = Number(selectElement.value);
      const newReasonName = this.motivos_rechazo.find(
        (rechazo) => rechazo.id === newReasonId
      );
      const dataSourceIndex = this.dataSource.indexOf(row);
      this.dataSource[dataSourceIndex].reason_rejection_id = newReasonId;
      this.dataSource[dataSourceIndex].reason_rejection =
        newReasonName?.name ?? 'No encontrado';
    }
  }

  changeEstado(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const newStatusId = Number(selectElement.value);
      const newStatusName = this.estados.find(
        (estado) => estado.id === newStatusId
      );

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].status_id = newStatusId;
      this.dataSource[dataSourceIndex].status =
        newStatusName?.name ?? 'No encontrado';
    }
  }

  changeCompetidor(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newCompetidorId = Number(selectElement.value);
      const newCompetidorName = this.competidores.find(
        (competidor) => competidor.id === newCompetidorId
      );

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].competitor_id = newCompetidorId;
      this.dataSource[dataSourceIndex].competitor_name =
        newCompetidorName?.name ?? 'No encontrado';
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadRechazos();
  }

  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadRechazos();
  }

  //Funcion filtros
  onFiltersChanged(selectedFilters: { [key: string]: any }) {
    console.log('Filtros seleccionados:', selectedFilters);
    this.selectedFilters = selectedFilters;
    this.currentPage = 1;
    this.loadRechazos();
  }
  /* logica para que aparezca tooltip cuando el texto es muy grande */
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
    console.log(this.searchTerm);
    this.currentPage = 1;
    this.loadRechazos();
  }

  onSearchTermChange() {
    if (this.searchTerm === '') {
      this.buscar();
    }
  }
}
