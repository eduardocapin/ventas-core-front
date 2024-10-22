import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PopupMapComponent } from './popup-map-rechazos/popup-map-rechazos.component';
import { IRechazo } from 'src/app/models/rechazos.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { IEstado } from 'src/app/models/estados.model';
import { ISimbolo } from 'src/app/models/simbolos.model';
import { ExportService } from 'src/app/services/export/export.service';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupClientDetailComponent } from 'src/app/clients/clients-general/popup-client-detail/popup-client-detail.component';
import { ICompetidor } from 'src/app/models/competidor.model';
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';
import { IProvincia } from 'src/app/models/provincias.model';
import { IPoblacion } from 'src/app/models/poblaciones.model';
import { ReasonsRejectionsComponent } from 'src/app/configuration/configuration-general/reasons-rejections/reasons-rejections.component';
import { AddCompetitorComponent } from 'src/app/configuration/configuration-general/add-competitor/add-competitor.component';
import { NotificationService } from 'src/app/services/notification/notification.service';

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
  cargando_filtros = true;

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

  // Variable para manejar si el texto está truncado
  isTooltipVisible: boolean = false;
  tooltipText: string | null = null;
  selectedFilters: { [key: string]: any } = [
    {
      id: 'status_id',
      nombre: 'Estados',
      valor: [
        {
          id: 5,
          name: 'Pendiente',
          selected: true,
        },
      ],
      tipo: 'multi-select',
    },
  ];
  searchTerm: string = '';

  //ordeanacion
  sortColumn: string = 'r.last_rejection_date';
  sortDirection: string = 'desc';

  // Añadir motivos y competidores
  private previousReasonId?: number;
  private previousCompetitorId?: number;

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private rechazadosService: RechazadosService,
    private filterService: FilterService,
    private _exportService: ExportService,
    private _notifactionService: NotificationService,
    private router: Router
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
    this.cargando = true;
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
    if (
      this.currentPage === 1 &&
      !this.searchTerm &&
      Object.keys(this.selectedFilters).length === 0
    ) {
      this.cargando = true;
    } else {
      this.cargando_filtros = true;
    }
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
        this.cargando_filtros = false;
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
      this._notifactionService.showWarning(
        'Debe seleccionar al menos 1 rechazo antes de ver en el mapa.'
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
            this._notifactionService.showSuccess(
              'Símbolo actualizado correctamente.'
            );
          },
          (error) => {
            this._notifactionService.showError(
              'Error al actualizar el símbolo.'
            );
            console.error('Error al actualizar el símbolo:', error);
          }
        );
    }
  }

  exportData(selectedOption: string): void {
    if (this.selectedRechazos.length <= 0) {
      this._notifactionService.showWarning(
        'Debe seleccionar al menos 1 rechazo antes de exportar.'
      );
      return;
    }
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[-T:]/g, '-');

    const fileName = `exportacion_rechazos_${timestamp}`;

    if (selectedOption === 'Excel') {
      this._exportService.exportToExcel(this.selectedRechazos, fileName);
    } else if (selectedOption === 'CSV') {
      this._exportService.exportToCSV(this.selectedRechazos, fileName);
    } else if (selectedOption === 'Json') {
      this._exportService.exportToJson(this.selectedRechazos, fileName);
    }
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
      if (newReasonId === 0) {
        this.openReasonsRejections()
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.motivos_rechazo.push(result);
              //this.loadTiposRechazo();
              row.reason_rejection_id = result.id;
              row.reason_rejection = result.name;
            } else {
              selectElement.value = String(this.previousReasonId);
            }
          });
        return;
      }

      const newReasonName = this.motivos_rechazo.find(
        (rechazo) => rechazo.id === newReasonId
      );
      row.reason_rejection_id = newReasonId;
      row.reason_rejection = newReasonName?.name ?? 'No encontrado';
    }
  }

  capturePreviousValueReasonId(row: IRechazo) {
    this.previousReasonId = row.reason_rejection_id;
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

      if (newCompetidorId === 0) {
        this.openCompetitor()
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.competidores.push(result);
              row.competitor_id = result.id;
              row.competitor_name = result.name;
            } else {
              selectElement.value = String(this.previousCompetitorId);
            }
          });
        return;
      }
      const newCompetidorName = this.competidores.find(
        (competidor) => competidor.id === newCompetidorId
      );

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].competitor_id = newCompetidorId;
      this.dataSource[dataSourceIndex].competitor_name =
        newCompetidorName?.name ?? 'No encontrado';
    }
  }

  capturePreviousValueCompetitorId(row: IRechazo) {
    this.previousCompetitorId = row.competitor_id;
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

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadRechazos();
  }

  openReasonsRejections() {
    const dialogRef = this.dialog.open(ReasonsRejectionsComponent, {
      width: 'auto',
      disableClose: true,
      data: { autoClose: true },
    });
    return dialogRef;
  }

  openCompetitor() {
    const dialogRef = this.dialog.open(AddCompetitorComponent, {
      width: 'auto',
      disableClose: true,
      data: { autoClose: true },
    });
    return dialogRef;
  }
}
