import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { timeout, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { IEntityTableConfig, IEntityDataService } from 'src/app/models/entityTableConfig.model';
import { ITableColumn } from 'src/app/models/tableColumn.model';
import { IGroupOption } from 'src/app/models/groupOption.model';
import { IHeaderItem } from 'src/app/models/tableHeader.model';
import { GroupByService } from 'src/app/services/group-by/group-by.service';
import { ExportService } from 'src/app/services/export/export.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'mobentis-entity-table-manager',
  templateUrl: './entity-table-manager.component.html',
  styleUrls: ['./entity-table-manager.component.scss'],
})
export class EntityTableManagerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config!: IEntityTableConfig;
  @Output() action = new EventEmitter<{ type: string; data: any }>();
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() selectionDataChange = new EventEmitter<any[]>();
  @Output() facturarClick = new EventEmitter<{ selectedIds: number[]; selectedData: any[]; fecha: NgbDateStruct }>();

  // Columnas
  tableColumns: ITableColumn[] = [];
  groupedColumns: Record<string, ITableColumn[]> = {};

  // Datos
  dataSource: { data: any[] } = { data: [] };

  // Selección - UN SOLO ARRAY GLOBAL que persiste siempre
  selectedIds: number[] = [];
  selectedDataMap: Map<number, any> = new Map(); // Cache de datos completos seleccionados

  // Paginación
  currentPage = 1;
  itemsPerPage = 10;
  totalItems: number = 0;

  // Agrupación
  groupBy?: IGroupOption | null;
  groupByChain: IGroupOption[] = []; // Cadena de agrupaciones (jerárquica)
  groups: any[] = [];
  groupedData: { [key: string]: any[] } = {};
  groupedTotalItems: { [key: string]: number } = {};
  groupedCurrentPage: { [key: string]: number } = {};
  groupedItemsPerPage: { [key: string]: number } = {};

  // Sub-grupos (agrupación anidada: equipos -> agentes)
  subGroups: { [parentKey: string]: any[] } = {}; // Sub-grupos por grupo padre
  subGroupedData: { [parentKey: string]: { [subGroupKey: string]: any[] } } = {}; // Datos de sub-grupos
  subGroupedTotalItems: { [parentKey: string]: { [subGroupKey: string]: number } } = {}; // Totales de sub-grupos
  subGroupedCurrentPage: { [parentKey: string]: { [subGroupKey: string]: number } } = {}; // Página actual de sub-grupos
  subGroupedItemsPerPage: { [parentKey: string]: { [subGroupKey: string]: number } } = {}; // Items por página de sub-grupos
  subGroupedColumns: { [parentKey: string]: { [subGroupKey: string]: ITableColumn[] } } = {}; // Columnas de sub-grupos

  // Ordenación
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Búsqueda y filtros
  searchTerm: string = '';
  selectedFilters: { [key: string]: any } = {};
  mostrarError: boolean = false;

  // Estados
  cargando: boolean = true;
  cargando_filtros: boolean = true;

  // Fecha para facturación
  facturarDate: NgbDateStruct | null = null;

  // Scroll listener
  private accordionScrollHandler?: (event: any) => void;

  constructor(
    private _groupByService: GroupByService,
    private cdr: ChangeDetectorRef,
    private _exportService: ExportService,
    private _notificationService: NotificationService,
    private _dateFormatter: NgbDateParserFormatter
  ) {}

  ngOnInit(): void {
    if (!this.config) {
      console.error('EntityTableManagerComponent: config is required');
      return;
    }

    this.itemsPerPage = this.config.defaultItemsPerPage || 10;
    this.tableColumns = this.cloneColumns(this.config.columns);
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.setupAccordionScrollListener();
  }

  ngOnDestroy(): void {
    if (this.accordionScrollHandler) {
      document.removeEventListener('shown.bs.collapse', this.accordionScrollHandler);
    }
  }

  // ========== Carga de datos ==========

  loadData(): void {
    if (!this.groupBy) {
      this.loadAllData();
    } else {
      this.loadGroups();
    }
  }

  private loadAllData(): void {
    if (this.currentPage === 1 && !this.searchTerm && Object.keys(this.selectedFilters).length === 0) {
      this.cargando = true;
    } else {
      this.cargando_filtros = true;
    }

    const service = this.config.dataService as IEntityDataService;
    service
      .getData(
        this.selectedFilters,
        this.searchTerm,
        this.currentPage,
        this.itemsPerPage,
        this.sortColumn,
        this.sortDirection
      )
      .pipe(timeout(20000))
      .subscribe({
        next: (data: any) => {
          const newData = data.items || [];
          this.dataSource.data = newData;
          this.totalItems = data.totalItems || 0;

          // Actualizar el mapa de datos seleccionados para los items de la página actual
          newData.forEach((item: any) => {
            const itemId = this.getId(item);
            if (this.selectedIds.includes(itemId)) {
              this.selectedDataMap.set(itemId, item);
            }
          });

          this.cargando_filtros = false;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.cargando_filtros = false;
          this.cargando = false;
          this.cdr.markForCheck();
        },
      });
  }

  private loadGroups(): void {
    if (!this.groupBy?.endpoint) return;

    // Guardar qué grupos tenían datos cargados antes de recargar
    const previouslyLoadedGroups = Object.keys(this.groupedData);

    this._groupByService.getGroupValues(
      this.groupBy.endpoint,
      this.selectedFilters,
      this.searchTerm
    ).subscribe({
      next: (groups) => {
        // Limpiar datos de grupos que ya no existen
        this.groupedData = {};
        this.groupedCurrentPage = {};
        this.groupedItemsPerPage = {};
        this.groupedTotalItems = {};
        this.groupedColumns = {};
        
        // Limpiar sub-grupos
        this.subGroups = {};
        this.subGroupedData = {};
        this.subGroupedTotalItems = {};
        this.subGroupedCurrentPage = {};
        this.subGroupedItemsPerPage = {};
        this.subGroupedColumns = {};

        // Inicializar grupos
        this.groups = (groups || []).map((group: any, index: number) => {
          const groupKey = this.buildGroupKey(group, index);
          const domId = this.buildGroupDomId(groupKey, index);
          const normalizedGroup = { ...group, __key: groupKey, __domId: domId };
          this.groupedCurrentPage[groupKey] = 1;
          this.groupedItemsPerPage[groupKey] = this.itemsPerPage;
          this.ensureGroupColumns(groupKey);
          return normalizedGroup;
        });

        // Recargar datos de los grupos que estaban previamente cargados
        // y que aún existen en la nueva lista de grupos
        const newGroupKeys = this.groups.map(g => g.__key);
        previouslyLoadedGroups.forEach(oldGroupKey => {
          if (newGroupKeys.includes(oldGroupKey)) {
            // El grupo aún existe, recargar sus datos
            this.loadGroupData(oldGroupKey);
          }
        });

        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener grupos:', error);
        this.cdr.markForCheck();
      },
    });
  }

  private loadGroupData(groupKey: string): void {
    this.ensureGroupColumns(groupKey);

    const groupByParam = { field: this.groupBy?.field ?? '', value: groupKey };

    const service = this.config.dataService as IEntityDataService;
    service
      .getData(
        this.selectedFilters,
        this.searchTerm,
        this.groupedCurrentPage[groupKey],
        this.groupedItemsPerPage[groupKey],
        this.sortColumn,
        this.sortDirection,
        groupByParam
      )
      .subscribe({
        next: (data: any) => {
          const newData = data.items || [];
          this.groupedData[groupKey] = [...newData];
          this.groupedTotalItems[groupKey] = data.totalItems || 0;

          // Actualizar el mapa de datos seleccionados para los items de la página actual
          newData.forEach((item: any) => {
            const itemId = this.getId(item);
            if (this.selectedIds.includes(itemId)) {
              this.selectedDataMap.set(itemId, item);
            }
          });

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(`Error al cargar grupo ${groupKey}:`, error);
          this.cdr.markForCheck();
        },
      });
  }

  // ========== Eventos de tabla ==========

  onSelectionChange(selectedIdsFromTable: number[]): void {
    // La tabla emite los IDs que deberían estar seleccionados en la página actual
    // Actualizamos el array global manteniendo los IDs de otras páginas
    
    // Obtener los IDs de la página actual
    const currentPageIds = this.dataSource.data.map((item: any) => this.getId(item));
    
    // Separar: IDs de otras páginas + IDs de esta página
    const idsFromOtherPages = this.selectedIds.filter(id => !currentPageIds.includes(id));
    
    // Combinar: IDs de otras páginas + IDs de esta página (según lo que emitió la tabla)
    this.selectedIds = Array.from(new Set([...idsFromOtherPages, ...selectedIdsFromTable]));
    
    // Actualizar el mapa de datos seleccionados con los datos de la página actual
    this.dataSource.data.forEach((item: any) => {
      const itemId = this.getId(item);
      if (selectedIdsFromTable.includes(itemId)) {
        this.selectedDataMap.set(itemId, item);
      } else {
        // Solo eliminar del mapa si realmente no está seleccionado globalmente
        if (!this.selectedIds.includes(itemId)) {
          this.selectedDataMap.delete(itemId);
        }
      }
    });
    
    // Obtener todos los datos seleccionados del mapa
    const selectedData = Array.from(this.selectedDataMap.values());
    
    if (this.config.onSelectionChange) {
      this.config.onSelectionChange(this.selectedIds);
    }
    this.selectionChange.emit(this.selectedIds);
    this.selectionDataChange.emit(selectedData);
  }

  onGroupSelectionChange(groupKey: string, selectedIdsFromTable: number[]): void {
    // La tabla del grupo emite los IDs que deberían estar seleccionados en la página actual del grupo
    // Actualizamos el array global manteniendo los IDs de otras páginas/grupos
    
    const groupData = this.groupedData[groupKey] || [];
    const currentPageIds = groupData.map((item: any) => this.getId(item));
    
    // Separar: IDs de otras páginas/grupos + IDs de esta página del grupo
    const idsFromOtherPages = this.selectedIds.filter(id => !currentPageIds.includes(id));
    
    // Combinar: IDs de otras páginas/grupos + IDs de esta página del grupo
    this.selectedIds = Array.from(new Set([...idsFromOtherPages, ...selectedIdsFromTable]));
    
    // Actualizar el mapa de datos seleccionados con los datos del grupo actual
    groupData.forEach((item: any) => {
      const itemId = this.getId(item);
      if (selectedIdsFromTable.includes(itemId)) {
        this.selectedDataMap.set(itemId, item);
      } else {
        // Solo eliminar del mapa si realmente no está seleccionado globalmente
        if (!this.selectedIds.includes(itemId)) {
          this.selectedDataMap.delete(itemId);
        }
      }
    });
    
    // Obtener todos los datos seleccionados del mapa
    const selectedData = Array.from(this.selectedDataMap.values());
    
    if (this.config.onSelectionChange) {
      this.config.onSelectionChange(this.selectedIds);
    }
    this.selectionChange.emit(this.selectedIds);
    this.selectionDataChange.emit(selectedData);
  }

  onSortChange(sortEvent: { sortColumn: string; sortDirection: 'asc' | 'desc' }): void {
    this.sortColumn = sortEvent.sortColumn;
    this.sortDirection = sortEvent.sortDirection;
    this.currentPage = 1;

    if (this.groupBy) {
      Object.keys(this.groupedCurrentPage).forEach((groupKey) => {
        this.groupedCurrentPage[groupKey] = 1;
        this.loadGroupData(groupKey);
      });
    } else {
      this.loadData();
    }
  }

  onTableAction(actionEvent: { type: string; data: any }): void {
    this.action.emit(actionEvent);
  }

  onFacturarClick(): void {
    // Validar que haya fecha seleccionada
    if (!this.facturarDate) {
      this._notificationService.showWarning('Tienes que seleccionar una fecha para generar un PDF');
      return;
    }

    const selectedData = Array.from(this.selectedDataMap.values());
    this.facturarClick.emit({
      selectedIds: this.selectedIds,
      selectedData: selectedData,
      fecha: this.facturarDate
    });
  }

  onFacturarDateChange(date: NgbDateStruct | null): void {
    this.facturarDate = date;
    this.cdr.markForCheck();
  }

  getFormattedDate(): string {
    if (!this.facturarDate) return '';
    return this._dateFormatter.format(this.facturarDate);
  }

  // ========== Paginación ==========

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadData();
  }

  onItemsPerPageChanged(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadData();
  }

  onGroupPageChanged(groupKey: string, page: number): void {
    this.groupedCurrentPage[groupKey] = page;
    this.loadGroupData(groupKey);
  }

  onGroupItemsPerPageChanged(groupKey: string, newItemsPerPage: number): void {
    this.groupedItemsPerPage[groupKey] = newItemsPerPage;
    this.groupedCurrentPage[groupKey] = 1;
    this.loadGroupData(groupKey);
  }

  // ========== Búsqueda y filtros ==========

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.closeAllAccordions();
    this.loadData();
  }

  onFiltersChanged(selectedFilters: { [key: string]: any }): void {
    this.selectedFilters = selectedFilters;
    this.currentPage = 1;
    this.closeAllAccordions();
    this.loadData();
  }

  // ========== Agrupación ==========

  onGroupByChange(groupByOption: IGroupOption | null): void {
    // Cerrar todos los acordeones antes de cambiar la agrupación
    this.closeAllAccordions();
    
    // NO hacer nada especial con las selecciones - simplemente mantener el array global
    // Las selecciones se mantienen automáticamente porque selectedIds es global
    
    if (!groupByOption) {
      // Cambiar de agrupado a no agrupado
      this.groupBy = null;
      this.groupByChain = [];
      this.groupedData = {};
      this.subGroups = {};
      this.subGroupedData = {};
      this.loadData();
    } else {
      // Si la opción tiene childGroupBy, usarlo directamente
      // Si no, usar solo la opción seleccionada
      this.groupBy = groupByOption;
      
      // Construir la cadena de agrupaciones jerárquicas para referencia
      this.groupByChain = [];
      let current: IGroupOption | undefined = groupByOption;
      while (current) {
        this.groupByChain.push(current);
        current = current.childGroupBy;
      }
      
      // Cambiar de no agrupado a agrupado
      // Los selectedIds se mantienen, solo cargar los grupos
      this.loadGroups();
    }
  }

  onGroupToggled(group: any): void {
    const key = group.__key ?? this.buildGroupKey(group);
    
    // Si el grupo tiene childGroupBy configurado, solo cargar sub-grupos (no datos del grupo padre)
    if (this.groupBy?.childGroupBy) {
      if (!this.subGroups[key]) {
        this.loadSubGroups(key);
      }
    } else {
      // Si NO tiene childGroupBy, cargar datos del grupo padre normalmente
    if (!this.groupedData[key]) {
      this.loadGroupData(key);
      }
    }
  }

  // Cargar sub-grupos de un grupo padre (ej: agentes de un equipo)
  private loadSubGroups(parentKey: string): void {
    if (!this.groupBy?.childGroupBy) return;

    const parentGroup = this.groups.find(g => (g.__key ?? this.buildGroupKey(g)) === parentKey);
    if (!parentGroup) return;

    // Extraer el ID del grupo padre
    const parentId = typeof parentGroup.id === 'string' ? parseInt(parentGroup.id, 10) : parentGroup.id;
    
    // Determinar qué endpoint usar según el childGroupBy
    // Caso 1: Equipo -> Agente (endpoint de childGroupBy es de agentes)
    const isAgentEndpoint = this.groupBy.childGroupBy.endpoint === 'incentive-agent' || 
                           this.groupBy.childGroupBy.endpoint === 'monthly-goal-agent';
    
    // Caso 2: Agente -> Equipo (endpoint de childGroupBy es de equipos)
    const isTeamEndpoint = this.groupBy.childGroupBy.endpoint === 'incentive-team' || 
                          this.groupBy.childGroupBy.field === 'idEquipoVenta';
    
    // Caso 3: Equipo -> Incentivo (endpoint de childGroupBy es de incentivos)
    const isIncentiveEndpoint = this.groupBy.childGroupBy.endpoint === 'incentive' || 
                                this.groupBy.childGroupBy.field === 'idIncentivo';
    
    // Caso 4: Incentivo -> Equipo (padre es incentivo, hijo es equipo)
    const isIncentiveToTeam = (this.groupBy.field === 'idIncentivo' || this.groupBy.endpoint === 'incentive') &&
                               (this.groupBy.childGroupBy.field === 'idEquipoVenta' || this.groupBy.childGroupBy.endpoint === 'incentive-team');
    
    // Caso 5: Agente -> Incentivo (padre es agente, hijo es incentivo)
    const isAgentToIncentive = (this.groupBy.field === 'idAgente' || this.groupBy.endpoint === 'incentive-agent' || this.groupBy.endpoint === 'monthly-goal-agent') &&
                                (this.groupBy.childGroupBy.field === 'idIncentivo' || this.groupBy.childGroupBy.endpoint === 'incentive');
    
    // Caso 6: Incentivo -> Agente (padre es incentivo, hijo es agente)
    const isIncentiveToAgent = (this.groupBy.field === 'idIncentivo' || this.groupBy.endpoint === 'incentive') &&
                                (this.groupBy.childGroupBy.field === 'idAgente' || this.groupBy.childGroupBy.endpoint === 'incentive-agent' || this.groupBy.childGroupBy.endpoint === 'monthly-goal-agent');

    if (isAgentEndpoint && (this.groupBy.field === 'idEquipoVenta' || this.groupBy.endpoint === 'incentive-team')) {
      // Caso: Equipo (padre) -> Agente (hijo)
      // Usar getTeamAgents para obtener agentes del equipo padre
      this._groupByService.getTeamAgents(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else if (isTeamEndpoint && (this.groupBy.field === 'idAgente' || this.groupBy.endpoint === 'incentive-agent' || this.groupBy.endpoint === 'monthly-goal-agent')) {
      // Caso: Agente (padre) -> Equipo (hijo)
      // Usar getAgentTeams para obtener equipos del agente padre
      this._groupByService.getAgentTeams(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else if (isIncentiveEndpoint && (this.groupBy.field === 'idEquipoVenta' || this.groupBy.endpoint === 'incentive-team')) {
      // Caso: Equipo (padre) -> Incentivo (hijo)
      // Usar getTeamIncentives para obtener incentivos del equipo padre
      this._groupByService.getTeamIncentives(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else if (isIncentiveToTeam) {
      // Caso: Incentivo (padre) -> Equipo (hijo)
      // Usar getIncentiveTeam para obtener el equipo del incentivo padre
      this._groupByService.getIncentiveTeam(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else if (isAgentToIncentive) {
      // Caso: Agente (padre) -> Incentivo (hijo)
      // Usar getAgentIncentives para obtener los incentivos de los equipos del agente padre
      this._groupByService.getAgentIncentives(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else if (isIncentiveToAgent) {
      // Caso: Incentivo (padre) -> Agente (hijo)
      // Usar getIncentiveAgents para obtener los agentes del equipo del incentivo padre
      this._groupByService.getIncentiveAgents(
        parentId,
        this.selectedFilters,
        this.searchTerm
      ).subscribe({
        next: (subGroups) => {
          this.handleSubGroupsResponse(parentKey, subGroups);
        },
        error: (error) => {
          console.error(`Error al cargar sub-grupos para ${parentKey}:`, error);
          this.cdr.markForCheck();
        },
      });
    } else {
      console.warn('El endpoint de sub-grupos no es compatible con agrupación anidada:', {
        parentField: this.groupBy.field,
        parentEndpoint: this.groupBy.endpoint,
        childField: this.groupBy.childGroupBy.field,
        childEndpoint: this.groupBy.childGroupBy.endpoint
      });
      return;
    }
  }

  private handleSubGroupsResponse(parentKey: string, subGroups: any[]): void {
    // Inicializar estructuras para sub-grupos
    if (!this.subGroups[parentKey]) {
      this.subGroups[parentKey] = [];
    }
    if (!this.subGroupedData[parentKey]) {
      this.subGroupedData[parentKey] = {};
    }
    if (!this.subGroupedTotalItems[parentKey]) {
      this.subGroupedTotalItems[parentKey] = {};
    }
    if (!this.subGroupedCurrentPage[parentKey]) {
      this.subGroupedCurrentPage[parentKey] = {};
    }
    if (!this.subGroupedItemsPerPage[parentKey]) {
      this.subGroupedItemsPerPage[parentKey] = {};
    }
    if (!this.subGroupedColumns[parentKey]) {
      this.subGroupedColumns[parentKey] = {};
    }

    // Normalizar sub-grupos
    this.subGroups[parentKey] = (subGroups || []).map((subGroup: any, index: number) => {
      const subGroupKey = this.buildSubGroupKey(parentKey, subGroup, index);
      const domId = this.buildSubGroupDomId(parentKey, subGroupKey, index);
      const normalizedSubGroup = { ...subGroup, __key: subGroupKey, __domId: domId, __parentKey: parentKey };
      this.subGroupedCurrentPage[parentKey][subGroupKey] = 1;
      this.subGroupedItemsPerPage[parentKey][subGroupKey] = this.itemsPerPage;
      this.ensureSubGroupColumns(parentKey, subGroupKey);
      return normalizedSubGroup;
    });

    this.cdr.markForCheck();
  }


  // Construir key única para un sub-grupo
  private buildSubGroupKey(parentKey: string, subGroup: any, index: number): string {
    if (subGroup.id !== undefined && subGroup.id !== null) {
      return `${parentKey}_sub_${subGroup.id}`;
    }
    return `${parentKey}_sub_${index}`;
  }

  // Construir DOM ID único para un sub-grupo
  private buildSubGroupDomId(parentKey: string, subGroupKey: string, index: number): string {
    return `subgroup_${parentKey}_${index}_${subGroupKey.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  // Asegurar que existan columnas para un sub-grupo
  private ensureSubGroupColumns(parentKey: string, subGroupKey: string): void {
    if (!this.subGroupedColumns[parentKey][subGroupKey]) {
      this.subGroupedColumns[parentKey][subGroupKey] = [...this.tableColumns];
    }
  }

  // Cargar datos de un sub-grupo específico
  private loadSubGroupData(parentKey: string, subGroupKey: string): void {
    this.ensureSubGroupColumns(parentKey, subGroupKey);

    // Construir groupBy param combinando padre e hijo
    const parentGroup = this.groups.find(g => (g.__key ?? this.buildGroupKey(g)) === parentKey);
    const subGroup = this.subGroups[parentKey]?.find(sg => sg.__key === subGroupKey);
    
    if (!parentGroup || !subGroup) {
      console.warn('No se encontró parentGroup o subGroup:', { parentKey, subGroupKey, parentGroup, subGroup });
      return;
    }

    // Extraer el ID del sub-grupo (agente) - usar directamente subGroup.id si está disponible
    let subGroupId: string | number = subGroup.id;
    // Si no tiene id, intentar extraerlo del subGroupKey
    if (subGroupId === undefined || subGroupId === null) {
      const keyMatch = subGroupKey.match(/_sub_(.+)$/);
      subGroupId = keyMatch ? keyMatch[1] : subGroupKey.replace(`${parentKey}_sub_`, '');
    }
    
    // Extraer el ID del grupo padre (equipo)
    let parentId: string | number = parentGroup.id;
    if (parentId === undefined || parentId === null) {
      parentId = parentKey;
    }
    
    // Convertir a número si son strings numéricos
    const subGroupIdNum = typeof subGroupId === 'string' ? parseInt(subGroupId, 10) : subGroupId;
    const parentIdNum = typeof parentId === 'string' ? parseInt(parentId, 10) : parentId;
    
    // Si la conversión fue exitosa, usar el número, sino el string original
    subGroupId = !isNaN(subGroupIdNum) ? subGroupIdNum : subGroupId;
    parentId = !isNaN(parentIdNum) ? parentIdNum : parentId;

    console.log('loadSubGroupData:', {
      parentKey,
      subGroupKey,
      parentGroup: { id: parentGroup.id, name: parentGroup.name },
      subGroup: { id: subGroup.id, name: subGroup.name },
      parentId,
      subGroupId,
      parentField: this.groupBy?.field,
      childField: this.groupBy?.childGroupBy?.field
    });

    // Para agrupación anidada, combinamos filtros del padre (equipo) y del hijo (agente)
    // Agregamos el filtro del equipo padre a los selectedFilters
    const combinedFilters = {
      ...this.selectedFilters,
      // Agregar filtro del equipo padre si existe el campo
      ...(this.groupBy?.field && { [this.groupBy.field]: parentId }),
    };

    // El groupBy param usa el campo del hijo (agente)
    const groupByParam = {
      field: this.groupBy?.childGroupBy?.field ?? '', // Campo del agente (ej: 'idAgente')
      value: String(subGroupId), // ID del agente como string para comparación
    };

    console.log('Filtros aplicados:', { combinedFilters, groupByParam });

    const service = this.config.dataService as IEntityDataService;
    service
      .getData(
        combinedFilters,
        this.searchTerm,
        this.subGroupedCurrentPage[parentKey][subGroupKey],
        this.subGroupedItemsPerPage[parentKey][subGroupKey],
        this.sortColumn,
        this.sortDirection,
        groupByParam
      )
      .subscribe({
        next: (data: any) => {
          console.log('Datos recibidos del sub-grupo:', { subGroupKey, totalItems: data.totalItems, itemsCount: data.items?.length });
          const newData = data.items || [];
          if (!this.subGroupedData[parentKey]) {
            this.subGroupedData[parentKey] = {};
          }
          this.subGroupedData[parentKey][subGroupKey] = [...newData];
          if (!this.subGroupedTotalItems[parentKey]) {
            this.subGroupedTotalItems[parentKey] = {};
          }
          this.subGroupedTotalItems[parentKey][subGroupKey] = data.totalItems || 0;

          // Actualizar el mapa de datos seleccionados
          newData.forEach((item: any) => {
            const itemId = this.getId(item);
            if (this.selectedIds.includes(itemId)) {
              this.selectedDataMap.set(itemId, item);
            }
          });

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error(`Error al cargar datos del sub-grupo ${subGroupKey}:`, error);
          this.cdr.markForCheck();
        },
      });
  }

  // Cuando se expande un sub-grupo, cargar sus datos
  onSubGroupToggled(parentKey: string, subGroup: any): void {
    const subGroupKey = subGroup.__key ?? this.buildSubGroupKey(parentKey, subGroup, 0);
    if (!this.subGroupedData[parentKey] || !this.subGroupedData[parentKey][subGroupKey]) {
      this.loadSubGroupData(parentKey, subGroupKey);
    }
  }

  getGroupHeaders(group: any): IHeaderItem[] {
    if (this.config.getGroupHeaders) {
      return this.config.getGroupHeaders(group, this.groupBy);
    }
    return [
      {
        label: this.groupBy?.name || 'Grupo',
        value: group.name || group.__key,
        icon: 'bi bi-people',
      },
    ];
  }

  trackByGroup(index: number, group: any): string {
    return group.__key || index.toString();
  }

  trackBySubGroup(index: number, subGroup: any): string {
    return subGroup.__key || index.toString();
  }

  // Obtener headers para un sub-grupo
  getSubGroupHeaders(parentGroup: any, subGroup: any): IHeaderItem[] {
    if (this.config.getGroupHeaders && this.groupBy?.childGroupBy) {
      return this.config.getGroupHeaders(subGroup, this.groupBy.childGroupBy);
    }
    return [
      {
        label: this.groupBy?.childGroupBy?.name || 'Sub-Grupo',
        value: subGroup.name || subGroup.__key,
        icon: 'bi bi-person',
      },
    ];
  }

  // Paginación de sub-grupos
  onSubGroupPageChanged(parentKey: string, subGroupKey: string, page: number): void {
    if (!this.subGroupedCurrentPage[parentKey]) {
      this.subGroupedCurrentPage[parentKey] = {};
    }
    this.subGroupedCurrentPage[parentKey][subGroupKey] = page;
    this.loadSubGroupData(parentKey, subGroupKey);
  }

  onSubGroupItemsPerPageChanged(parentKey: string, subGroupKey: string, itemsPerPage: number): void {
    if (!this.subGroupedItemsPerPage[parentKey]) {
      this.subGroupedItemsPerPage[parentKey] = {};
    }
    this.subGroupedItemsPerPage[parentKey][subGroupKey] = itemsPerPage;
    if (!this.subGroupedCurrentPage[parentKey]) {
      this.subGroupedCurrentPage[parentKey] = {};
    }
    this.subGroupedCurrentPage[parentKey][subGroupKey] = 1;
    this.loadSubGroupData(parentKey, subGroupKey);
  }

  // Selección de sub-grupos
  onSubGroupSelectionChange(parentKey: string, subGroupKey: string, selectedIdsFromTable: number[]): void {
    const subGroupData = (this.subGroupedData[parentKey] || {})[subGroupKey] || [];
    const currentPageIds = subGroupData.map((item: any) => this.getId(item));
    
    // Separar: IDs de otras páginas/grupos/sub-grupos + IDs de esta página del sub-grupo
    const idsFromOtherPages = this.selectedIds.filter(id => !currentPageIds.includes(id));
    
    // Combinar: IDs de otras páginas/grupos/sub-grupos + IDs de esta página del sub-grupo
    this.selectedIds = Array.from(new Set([...idsFromOtherPages, ...selectedIdsFromTable]));
    
    // Actualizar el mapa de datos seleccionados con los datos del sub-grupo actual
    subGroupData.forEach((item: any) => {
      const itemId = this.getId(item);
      if (selectedIdsFromTable.includes(itemId)) {
        this.selectedDataMap.set(itemId, item);
      } else {
        // Solo eliminar del mapa si realmente no está seleccionado globalmente
        if (!this.selectedIds.includes(itemId)) {
          this.selectedDataMap.delete(itemId);
        }
      }
    });
    
    // Obtener todos los datos seleccionados del mapa
    const selectedData = Array.from(this.selectedDataMap.values());
    
    if (this.config.onSelectionChange) {
      this.config.onSelectionChange(this.selectedIds);
    }
    this.selectionChange.emit(this.selectedIds);
    this.selectionDataChange.emit(selectedData);
  }

  // ========== Utilidades ==========

  private cloneColumns(columns: ReadonlyArray<ITableColumn>): ITableColumn[] {
    return columns.map((column) => ({
      ...column,
      actions: column.actions ? [...column.actions] : undefined,
    }));
  }

  private ensureGroupColumns(groupKey: string): ITableColumn[] {
    if (!this.groupedColumns[groupKey]) {
      const clonedColumns = this.cloneColumns(this.config.columns);

      if (this.groupBy?.hideField) {
        const columnToHide = clonedColumns.find((col) => col.field === this.groupBy?.hideField);
        if (columnToHide) {
          columnToHide.visible = false;
        }
      }

      this.groupedColumns[groupKey] = clonedColumns;
    }
    return this.groupedColumns[groupKey];
  }

  private buildGroupKey(group: any, index: number = 0): string {
    if (group && group.id !== undefined && group.id !== null) {
      return String(group.id);
    }
    if (group && group.name) {
      return String(group.name);
    }
    return `grupo-${index}`;
  }

  private buildGroupDomId(groupKey: string, index: number = 0): string {
    const sanitized = groupKey
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    const base = sanitized || 'grupo';
    return `${base}-${index}`;
  }

  getId(item: any): number {
    if (this.config.getId) {
      return this.config.getId(item);
    }
    return item.id;
  }

  isCheckboxDisabled(item: any): boolean {
    if (this.config.isCheckboxDisabled) {
      return this.config.isCheckboxDisabled(item);
    }
    return false;
  }

  // ========== Scroll automático ==========

  private setupAccordionScrollListener(): void {
    this.accordionScrollHandler = (event: any) => {
      const collapseElement = event.target;
      if (collapseElement && collapseElement.id && collapseElement.id.startsWith('collapsegroup')) {
        setTimeout(() => {
          this.scrollToPagination(collapseElement);
        }, 100);
      }
    };
    document.addEventListener('shown.bs.collapse', this.accordionScrollHandler);
  }

  // ========== Cerrar acordeones ==========

  private closeAllAccordions(): void {
    if (!this.groupBy || this.groups.length === 0) {
      return;
    }

    // Usar setTimeout para asegurar que el DOM esté actualizado
    setTimeout(() => {
      this.groups.forEach((group) => {
        const collapseId = `collapsegroup${group.__domId}`;
        const collapseElement = document.getElementById(collapseId);
        
        if (collapseElement) {
          // Verificar si Bootstrap está disponible
          if (typeof (window as any).bootstrap !== 'undefined') {
            const collapseInstance = (window as any).bootstrap.Collapse.getInstance(collapseElement);
            if (collapseInstance && collapseInstance._isShown) {
              collapseInstance.hide();
            }
          } else {
            // Fallback: cerrar manualmente removiendo la clase 'show'
            collapseElement.classList.remove('show');
            const button = document.querySelector(`[data-bs-target="#${collapseId}"]`) as HTMLElement;
            if (button) {
              button.classList.add('collapsed');
              button.setAttribute('aria-expanded', 'false');
            }
          }
        }
      });
    }, 0);
  }

  private scrollToPagination(collapseElement: HTMLElement): void {
    const paginationContainer = collapseElement.querySelector('.accordion-body .p-3.border-top.bg-light');

    if (paginationContainer) {
      paginationContainer.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });

      setTimeout(() => {
        const accordionBody = collapseElement.querySelector('.accordion-body');
        if (accordionBody) {
          const bodyRect = accordionBody.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const scrollOffset = bodyRect.bottom - windowHeight + 20;

          if (scrollOffset > 0) {
            window.scrollBy({
              top: scrollOffset,
              behavior: 'smooth',
            });
          }
        }
      }, 200);
    }
  }

  // ========== Getters para template ==========

  get showSearch(): boolean {
    return this.config.showSearch !== false;
  }

  get showFilters(): boolean {
    return this.config.showFilters !== false;
  }

  get showGroupBy(): boolean {
    return this.config.showGroupBy !== false && !!this.config.componentId;
  }

  get showExport(): boolean {
    return this.config.showExport === true;
  }

  get showFacturar(): boolean {
    return this.config.showFacturar === true;
  }

  // ========== Exportación ==========

  /**
   * Obtiene las columnas visibles (excluyendo checkbox y acciones)
   */
  /**
   * Obtiene todas las columnas de datos (incluyendo las ocultas, excluyendo checkbox, acciones e imágenes)
   */
  private getAllDataColumns(): ITableColumn[] {
    const columns = this.groupBy ? 
      (this.groupedColumns[Object.keys(this.groupedColumns)[0]] || this.tableColumns) :
      this.tableColumns;
    
    // Incluir todas las columnas de datos, incluso las ocultas (visible: false)
    // Excluir: checkbox, acciones e imágenes
    return columns.filter(col => 
      col.type !== 'checkbox' && 
      col.type !== 'acciones' &&
      col.type !== 'image'
    );
  }

  /**
   * Obtiene las columnas visibles (solo datos, no checkbox, acciones ni imágenes)
   * Mantenido por compatibilidad
   */
  private getVisibleDataColumns(): ITableColumn[] {
    const columns = this.groupBy ? 
      (this.groupedColumns[Object.keys(this.groupedColumns)[0]] || this.tableColumns) :
      this.tableColumns;
    
    return columns.filter(col => 
      col.visible !== false && 
      col.type !== 'checkbox' && 
      col.type !== 'acciones' &&
      col.type !== 'image'
    );
  }

  /**
   * Carga todos los datos del servidor para exportación (sin paginación)
   */
  private loadAllDataForExport(): Observable<any[]> {
    const service = this.config.dataService as IEntityDataService;
    
    // Cargar todos los datos con un número muy grande de items por página
    return service.getData(
      this.selectedFilters,
      this.searchTerm,
      1, // Página 1
      999999, // Número muy grande para obtener todos los datos
      this.sortColumn,
      this.sortDirection
    ).pipe(
      map((response: any) => response.items || [])
    );
  }

  /**
   * Exporta los datos según el tipo seleccionado.
   * @param exportType 'TablaCompleta' para exportar todas las columnas, 'ColumnasVisibles' para solo las visibles
   */
  exportData(exportType: string): void {
    // Determinar qué columnas exportar según el tipo
    const columnsToExport = exportType === 'TablaCompleta' 
      ? this.getAllDataColumns()      // Todas las columnas (incluyendo ocultas)
      : this.getVisibleDataColumns(); // Solo columnas visibles

    if (columnsToExport.length === 0) {
      this._notificationService.showWarning(
        'No hay columnas disponibles para exportar.'
      );
      return;
    }

    // Si hay datos seleccionados, usar esos datos
    if (this.selectedIds.length > 0) {
      const selectedData = Array.from(this.selectedDataMap.values());
      
      if (selectedData.length === 0) {
        this._notificationService.showWarning(
          'No hay datos disponibles para exportar.'
        );
        return;
      }

      this.exportDataWithColumns(selectedData, columnsToExport, 'Excel', exportType);
    } else {
      // Si no hay selección, cargar todos los datos del servidor
      this.loadAllDataForExport().subscribe({
        next: (allData: any[]) => {
          if (allData.length === 0) {
            this._notificationService.showWarning(
              'No hay datos disponibles para exportar.'
            );
            return;
          }
          this.exportDataWithColumns(allData, columnsToExport, 'Excel', exportType);
        },
        error: (error) => {
          console.error('Error al cargar datos para exportar:', error);
          this._notificationService.showError('Error al cargar los datos para exportar.');
        }
      });
    }
  }

  /**
   * Exporta los datos con las columnas especificadas
   */
  private exportDataWithColumns(data: any[], columns: ITableColumn[], format: string, exportType?: string): void {
    // Preparar los datos para exportar (todas las columnas, incluso ocultas)
    const dataToExport = data.map(item => {
      const exportItem: any = {};
      columns.forEach(column => {
        const value = this.getCellValue(item, column);
        // Usar el header como nombre de columna en el export
        const headerName = column.header || column.field;
        exportItem[headerName] = value;
      });
      return exportItem;
    });

    // Generar nombre de archivo con timestamp y tipo de exportación
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[-T:]/g, '-');
    const entityName = (this.config.entityName || 'datos').toLowerCase().replace(/\s+/g, '_');
    
    // Agregar sufijo según el tipo de exportación
    let typeSuffix = '';
    if (exportType === 'TablaCompleta') {
      typeSuffix = '_completa';
    } else if (exportType === 'ColumnasVisibles') {
      typeSuffix = '_visibles';
    }
    
    const fileName = `exportacion_${entityName}${typeSuffix}_${timestamp}`;

    // Exportar según el formato
    if (format === 'Excel') {
      const headerBgColor = this.config.headerBackgroundColor || '#3f51b5';
      const headerTextColor = this.config.headerTextColor || '#ffffff';
      this._exportService.exportToExcel(dataToExport, fileName, headerBgColor, headerTextColor);
    } else if (format === 'CSV') {
      this._exportService.exportToCSV(dataToExport, fileName);
    } else if (format === 'Json') {
      this._exportService.exportToJson(dataToExport, fileName);
    }
  }

  /**
   * Obtiene el valor de una celda según el tipo de columna
   */
  private getCellValue(item: any, column: ITableColumn): any {
    // Obtener el valor, manejando campos anidados (ej: cliente.nombre)
    let value: any;
    if (column.field.includes('.')) {
      const parts = column.field.split('.');
      value = item;
      for (const part of parts) {
        value = value?.[part];
        if (value === undefined || value === null) {
          break;
        }
      }
    } else {
      value = item[column.field];
    }

    // Manejar diferentes tipos de columnas
    switch (column.type) {
      case 'image':
        const imageUrl = value;
        return imageUrl || 'Sin imagen';
      
      case 'currency':
        return value !== null && value !== undefined ? 
          new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value) : 
          '';
      
      case 'number':
        return value !== null && value !== undefined ? 
          new Intl.NumberFormat('es-ES').format(value) : 
          '';
      
      case 'date':
        if (value) {
          const date = new Date(value);
          // Si el valor incluye información de hora, mostrar fecha y hora
          // Si solo es fecha, mostrar solo fecha
          const hasTime = value.toString().includes('T') || value.toString().includes(' ');
          if (hasTime) {
            // Formato con hora: dd/MM/yy HH:mm
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
          } else {
            // Formato solo fecha: dd/MM/yy
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear()).slice(-2);
            return `${day}/${month}/${year}`;
          }
        }
        return '';
      
      case 'boolean':
        return value ? 'Sí' : 'No';
      
      default:
        return value !== null && value !== undefined ? value : '';
    }
  }
}


