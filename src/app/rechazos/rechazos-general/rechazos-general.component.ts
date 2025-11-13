import { AfterViewInit, Component, OnInit, Renderer2, ChangeDetectorRef, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { CompetidoresService } from 'src/app/services/competitors/competidores.service';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { css } from 'jquery';
import { Empresa } from 'src/app/components/empresa-dropdown/empresa-dropdown.component';
import { AuthorizationService } from 'src/app/services/auth/authorization.service';


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
      id: 'r.status_id',
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
  mostrarError: boolean = false;
  //ordeanacion
  sortColumn: string = 'r.last_rejection_date';
  sortDirection: string = 'desc';

  // Filtro local de Empresa (1-3 o 'all')
  selectedEmpresa: number | 'all' = 'all';

  // Campo dinámico de empresa, obtiene de backend filters.controller.ts
  empresaFieldName: string = 'r.empresa_id'; // valor por defecto

  // Controlar visibilidad del dropdown de empresas
  get isEmpresaDropdownVisible(): boolean {
    const enabled = localStorage.getItem('empresaDropdownEnabled');
    return enabled !== null ? enabled === 'true' : true;
  }

  // Lista de empresas para el selector múltiple (dropdown)
  empresasList: Empresa[] = [
    { id: 1, name: 'Sarigabo', selected: true },
    { id: 2, name: 'Coca Cola', selected: true },
    { id: 3, name: 'Mercadona', selected: true }
  ];

  // Método que se ejecuta cuando cambian las empresas seleccionadas
  onEmpresasChange(empresas: Empresa[]): void {
    this.empresasList = empresas;
    this.applyEmpresaFilter();
    this.currentPage = 1;
    this.loadRechazos();
  }

  // Añadir motivos y competidores
  private previousReasonId?: number;
  private previousCompetitorId?: number;

  //mensaje de no guardado
  hasUnsavedChanges: boolean = false;
  // Variable para hacer referencia a la tabla de rechazos
  @ViewChild('tablaRechazos') tablaRechazos!: ElementRef;

  //select de fila
  selectedRowId: number | null = null;
  modifiedRow: number | null = null;


  dialogOpen: boolean = false; // Inicializa en false

  private documentClickListener!: () => void;

  // Permisos para edición de rechazos
  canEditMotivos: boolean = false;
  canEditEstado: boolean = false;
  canEditCompetidor: boolean = false;
  canEditAccionCorrectora: boolean = false;
  canEnviarAccionCorrectora: boolean = false;

  constructor(
    private renderer: Renderer2,
    public dialog: MatDialog,
    private rechazadosService: RechazadosService,
    private filterService: FilterService,
    private _exportService: ExportService,
    private _notifactionService: NotificationService,
    private _competidoresService: CompetidoresService,
    private cdr: ChangeDetectorRef,
    private authService: AuthorizationService

  ) { }

  ngOnInit() {
    // Verificar permisos del usuario
    this.checkUserPermissions();

    // Obtener la configuración de filtros desde el backend
    this.filterService.getFilterConfig('rechazos-general').subscribe(
      (config) => {
        this.empresaFieldName = config.empresaFieldName;
        console.log('Configuración de filtros obtenida:', config);
        this.applyEmpresaFilter(); // Aplicar filtro inicial con todas las empresas seleccionadas
        this.loadRechazos();
      },
      (error) => {
        console.error('Error al obtener la configuración de filtros:', error);
        // Si hay error, usar el valor por defecto y continuar
        this.applyEmpresaFilter();
        this.loadRechazos();
      }
    );
    
    this.loadEstados();
    this.loadProvincias();
    this.loadSimbolos();
    this.loadGoogleMapsScript();
    this.loadTiposRechazo();
    this.loadPoblacion();
    this.cargando = true;


    this.dataSource = this.dataSource.map(row => ({ ...row, modified: false }));

    this.documentClickListener = this.renderer.listen('document', 'click', (event) => this.onDocumentClick(event));
  }

  /**
   * Verificar permisos del usuario para editar rechazos
   */
  checkUserPermissions(): void {
    // Verificar si es Admin o Editor
    const isAdminOrEditor = this.authService.isAdminOrEditor();
    
    // Verificar permisos específicos
    this.canEditMotivos = isAdminOrEditor || this.authService.hasPermission('RECHAZOS_EDICION_MOTIVOS');
    this.canEditEstado = isAdminOrEditor || this.authService.hasPermission('RECHAZOS_EDICION_ESTADO');
    this.canEditCompetidor = isAdminOrEditor || this.authService.hasPermission('RECHAZOS_EDICION_COMPETIDOR');
    this.canEditAccionCorrectora = isAdminOrEditor || this.authService.hasPermission('RECHAZOS_EDICION_ACCION_CORRECTORA');
    this.canEnviarAccionCorrectora = isAdminOrEditor || this.authService.hasPermission('RECHAZOS_ENVIADO_ACCION_CORRECTORA');
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      this.documentClickListener(); // elimina el listener
    }
  }



  onDocumentClick(event: MouseEvent) {
    if (!this.tablaRechazos.nativeElement.contains(event.target)) {
      // Si hay cambios no guardados, se ejecuta el guardarCambios
      if (this.hasUnsavedChanges) {
        this.guardarCambios();
      }
    }
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

        // Guarda los valores originales en el Map
        this.originalValues.clear(); // Limpia valores anteriores
        rechazosData.forEach(row => {
          this.originalValues.set(row.id, {
            corrective_action_value: row.corrective_action_value,
            corrective_action_symbol_id: row.corrective_action_symbol_id,
            corrective_action_text: row.corrective_action_text,
          });
        });

        this.totalItems = data.totalItems;
        this.loadCompetidores()
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
    this.dataSource.forEach((row) => {
      this._competidoresService.getCompetidoresPorFamilia(row.family_id ?? -1).subscribe((competitors) => {
        row.competitors = competitors;
      });
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

  /* para guardar los valores originales de oportunidad */
  private originalValues = new Map<number, {
    corrective_action_value: number;
    corrective_action_symbol_id: number;
    corrective_action_text: string;
  }>();

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
    /*
    return (
      !row.latitude ||
      !row.longitude ||
      (row.latitude === 0 && row.longitude === 0)
    );*/
    return false;
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
    if (!this.canVerEnMapa()) {
      this._notifactionService.showWarning(
        'Debe seleccionar al menos 1 rechazo con coordenadas antes de ver en el mapa.'
      );
      return;
    }

    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '80%',
      height: '75%',
      data: { selectedRows: this.selectedRechazos.filter(row => row.latitude && row.longitude) },
    });
  }

  canVerEnMapa(): boolean {
    return this.selectedRechazos.some(
      row => row.latitude && row.longitude && !(row.latitude === 0 && row.longitude === 0)
    );
  }

  /* popup-rechazo-detail */
  viewRechazo(id_Cliente?: any) {
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      disableClose: true,
      data: { id: id_Cliente },
    });
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

  capturePreviousValueReasonId(row: IRechazo) {
    this.previousReasonId = row.reason_rejection_id;
  }


  /* cambios detectados en la fila */

  hayCaracteresProhibidos(termino: string): boolean {
    const caracteresProhibidos = /["'`]/g;
    return caracteresProhibidos.test(termino);
  }

  changeNumber(event: Event, row: IRechazo) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const newValue = Number(inputElement.value);

      // Encuentra el índice de la fila en dataSource
      const dataSourceIndex = this.dataSource.indexOf(row);
      // Actualiza el valor numérico en dataSource
      this.dataSource[dataSourceIndex].corrective_action_value = newValue;
      this.modifiedRow = row.id;
    }
    this.hasUnsavedChanges = true;
  }

  changeSymbol(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;
    if (selectElement) {
      const newSymbolId = Number(selectElement.value);
      const newSymbolName = this.simbolos.find(
        (simbolo) => simbolo.id === newSymbolId
      );

      const dataSourceIndex = this.dataSource.indexOf(row);
      this.dataSource[dataSourceIndex].corrective_action_symbol_id = newSymbolId;
      this.dataSource[dataSourceIndex].corrective_action_symbol =
        newSymbolName?.symbol ?? 'No encontrado';

      console.log('ID de Rechazo seleccionado:', row.id);
      this.modifiedRow = row.id;
    }
    this.hasUnsavedChanges = true;
  }

  changeText(newValue: string, row: IRechazo) {

    // Verifica si hay caracteres prohibidos
    if (this.hayCaracteresProhibidos(newValue)) {
      // Muestra una advertencia y no permite el cambio si hay caracteres prohibidos
      this._notifactionService.showWarning("La promoción contiene caracteres no permitidos.");
      return; // Sale de la función sin realizar cambios
    }

    // Encuentra el índice de la fila en `dataSource`
    const dataSourceIndex = this.dataSource.indexOf(row);

    // Actualiza el texto de `corrective_action_text`
    this.dataSource[dataSourceIndex].corrective_action_text = newValue;
    this.modifiedRow = row.id;
    // Marca cambios no guardados
    this.hasUnsavedChanges = true;
  }

  onStatusChange(event: { statusId: number; statusText: string }, row: IRechazo) {
    row.corrective_action_status_id = event.statusId;
    row.corrective_action_status = event.statusText

    // Si el estado cambia a 2, guarda los valores actuales como originales
    if (event.statusId === 2) {
      this.originalValues.set(row.id, {
        corrective_action_value: row.corrective_action_value,
        corrective_action_symbol_id: row.corrective_action_symbol_id,
        corrective_action_text: row.corrective_action_text,
      });
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

      this.modifiedRow = row.id;
    }
    this.hasUnsavedChanges = true;
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
              row.reason_rejection_id = result.id;
              row.reason_rejection = result.name;
              this.modifiedRow = row.id;
            } else {
              selectElement.value = String(this.previousReasonId);
            }
            this.loadTiposRechazo();
          });
        return;
      }

      const newReasonName = this.motivos_rechazo.find(
        (rechazo) => rechazo.id === newReasonId
      );
      row.reason_rejection_id = newReasonId;
      row.reason_rejection = newReasonName?.name ?? 'No encontrado';

      this.modifiedRow = row.id;
    }
    this.hasUnsavedChanges = true;
  }

  changeCompetidor(event: Event, row: IRechazo): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newCompetidorId = Number(selectElement.value);

      if (newCompetidorId === 0) {
        this.openCompetitor().afterClosed().subscribe((result) => {
          if (result) {
            row.competitor_id = result.id;
            row.competitor_name = result.name;
            this.modifiedRow = row.id;
          } else {
            selectElement.value = String(this.previousCompetitorId);
          }
          this.loadCompetidores();
        });
        return;
      }

      // Buscar el nombre del competidor seleccionado
      const newCompetidor = row.competitors.find(
        (competidor) => competidor.id === newCompetidorId
      );

      row.competitor_id = newCompetidorId;
      row.competitor_name = newCompetidor ? newCompetidor.name : 'No encontrado';
      this.modifiedRow = row.id;
    }
    this.hasUnsavedChanges = true;
  }
  /* fin de la decteccion de cambios en la fila */
  /* funcion para hacer un UPDATE a laa fila de rechazo */
  onRowEdit(row: IRechazo) {
    this.selectedRowId = row.id;
  }

  guardarCambios() {
    if (this.modifiedRow !== null) {
      const row = this.dataSource.find(item => item.id === this.modifiedRow);
      if (row) {
        // Verifica si el campo `corrective_action_text` contiene caracteres prohibidos
        if (this.hayCaracteresProhibidos(row.corrective_action_text)) {
          this._notifactionService.showWarning("La promoción contiene caracteres no permitidos. No se pueden guardar los cambios.");
          this.hasUnsavedChanges = false;
          this.modifiedRow = null;
          return;
        }

        // Recupera los valores originales si el estado está en 2
        const original = this.originalValues.get(row.id);

        // Si el estado está en 2 o 3, verifica si hubo cambios
        if ((row.corrective_action_status_id === 2 || row.corrective_action_status_id === 3) && original) {
          const hasChanges =
            row.corrective_action_value !== original.corrective_action_value ||
            row.corrective_action_symbol_id !== original.corrective_action_symbol_id ||
            row.corrective_action_text !== original.corrective_action_text;

          if (hasChanges) {
            if (row.corrective_action_status_id === 2) {
              // Cambia directamente a 1 si el estado está en 2
              const newStatus = { statusId: 1, statusText: 'Sin activar' };
              this.rechazadosService.updateEstadoAccionCorrectora(newStatus, row.id).subscribe(
                (status) => {
                  if (status === 'Success') {
                    this._notifactionService.showSuccess('Estado actualizado correctamente.');
                    row.corrective_action_status_id = newStatus.statusId;
                    row.corrective_action_status = newStatus.statusText;
                  }
                },
                (error) => {
                  console.error('Error al actualizar el estado:', error);
                  this.hasUnsavedChanges = false;
                  this.modifiedRow = null;
                  this._notifactionService.showError('Error al actualizar el estado.');
                }
              );
            } else if (row.corrective_action_status_id === 3 && !this.dialogOpen) {
              this.dialogOpen = true;
              // Confirma el cambio si el estado está en 3
              this.dialog
                .open(ConfirmDialogComponent, {
                  data: `¿Está seguro de cambiar el estado a "Sin activar"? Esto indicará que la acción requiere revisión nuevamente.`,
                })
                .afterClosed()
                .subscribe((confirmado: boolean) => {
                  this.dialogOpen = false;
                  if (confirmado) {
                    const newStatus = { statusId: 1, statusText: 'Sin activar' };
                    this.rechazadosService.updateEstadoAccionCorrectora(newStatus, row.id).subscribe(
                      (status) => {
                        if (status === 'Success') {
                          this._notifactionService.showSuccess('Estado actualizado correctamente.');
                          row.corrective_action_status_id = newStatus.statusId;
                          row.corrective_action_status = newStatus.statusText;
                        }
                      },
                      (error) => {
                        console.error('Error al actualizar el estado:', error);
                        this.hasUnsavedChanges = false;
                        this.modifiedRow = null;
                        this._notifactionService.showError('Error al actualizar el estado.');
                      }
                    );
                  }
                });
            }
          }
        }


        // Guarda los cambios
        this.rechazadosService.updateRechazo(row).subscribe(
          (status) => {
            console.log('Rechazo actualizado:', status);
            this._notifactionService.showSuccess('Cambios guardados correctamente.');
            this.modifiedRow = null;
            this.hasUnsavedChanges = false;
            // Actualiza los valores originales después de guardar
            this.originalValues.set(row.id, {
              corrective_action_value: row.corrective_action_value,
              corrective_action_symbol_id: row.corrective_action_symbol_id,
              corrective_action_text: row.corrective_action_text,
            });
          },
          (error) => {
            console.error('Error al actualizar el rechazo:', error);
            this.hasUnsavedChanges = false;
            this.modifiedRow = null;
            this._notifactionService.showError('Error al guardar los cambios.');
          }
        );
      }
    }
  }

  selectReject(rowId: number) {
    if (this.modifiedRow !== null && this.modifiedRow !== rowId) {
      this.guardarCambios(); // Guarda cambios de la fila anterior
    }
  }
  /* fin de la funcion UPDATE */

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
    this.selectedFilters = Object.values(selectedFilters);
    console.log(selectedFilters)
  // Garantiza que el filtro de empresa se mantenga cuando cambian otros filtros
  this.applyEmpresaFilter();
  // Fuerza nueva referencia para notificar a hijos (ej. KPI)
  this.selectedFilters = Array.isArray(this.selectedFilters) ? [...this.selectedFilters] : Object.values(this.selectedFilters || {});
    this.currentPage = 1;
    this.loadRechazos();
  }


  // Añade o elimina el filtro de empresa dentro de selectedFilters para que aplique en TODAS las consultas
  private applyEmpresaFilter(): void {
    // Normaliza selectedFilters como array
    const filters = Array.isArray(this.selectedFilters) ? [...this.selectedFilters] : Object.values(this.selectedFilters || {});

    // Usar el campo dinámico obtenido del backend
    // Elimina cualquier filtro previo de empresa
    const withoutEmpresa = filters.filter((f: any) => f?.id !== this.empresaFieldName);

    // Obtener empresas seleccionadas
    const empresasSeleccionadas = this.empresasList.filter(e => e.selected);

    // Si no están todas seleccionadas, agregar el filtro
    if (empresasSeleccionadas.length > 0 && empresasSeleccionadas.length < this.empresasList.length) {
      // Inserta el filtro de empresa en formato multi-select esperado por el backend
      withoutEmpresa.push({
        id: this.empresaFieldName,
        nombre: 'Empresa',
        tipo: 'multi-select',
        valor: empresasSeleccionadas.map(e => ({
          id: e.id,
          name: e.name
        }))
      });
    }

    this.selectedFilters = withoutEmpresa;
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

  // Función reutilizable para mostrar tooltip en selects
  showTooltipForSelect(event: MouseEvent, optionsList: any[], idKey: string, nameKey: string, minLength: number = 9) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = selectElement.selectedIndex;

    // Verificar si hay un elemento seleccionado
    if (selectedIndex === -1) {
      this.tooltipText = null;
      return; // Salir si no hay selección
    }

    const selectedOption = selectElement.options[selectedIndex];

    // Obtener el id seleccionado
    const selectedId = Number(selectedOption.value);

    // Buscar el texto correspondiente en la lista de opciones (motivos o competidores)
    const selectedItem = optionsList.find(option => option[idKey] === selectedId);

    // Si encontramos el elemento correspondiente, obtenemos su nombre
    const textoOpcion = selectedItem ? selectedItem[nameKey] : '';

    // Si el texto está vacío, no hacer nada
    if (!textoOpcion) {
      this.tooltipText = null; // Asegurarse de que no haya tooltip
      return; // Salir si el texto está vacío
    }

    // Crear un span temporal para medir el ancho del texto de la opción
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    tempSpan.textContent = textoOpcion;

    document.body.appendChild(tempSpan);

    const optionWidth = tempSpan.offsetWidth;
    const selectWidth = selectElement.offsetWidth;

    // Limpiar el span temporal
    document.body.removeChild(tempSpan);

    // Verificar si el texto está truncado o si es mayor a minLength caracteres
    if (optionWidth > selectWidth || textoOpcion.length > minLength) {
      this.tooltipText = textoOpcion; // Aquí obtendrás el texto del elemento seleccionado
      this.renderer.setStyle(selectElement, 'cursor', 'pointer'); // Cambia el cursor
    } else {
      this.tooltipText = null;
      this.renderer.removeStyle(selectElement, 'cursor'); // Cambia el cursor
    }

    // Forzar actualización para asegurar que el tooltip se muestre correctamente
    this.cdr.detectChanges();
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

  trackByFn(item: any) {
    return item.value;
  }




}
