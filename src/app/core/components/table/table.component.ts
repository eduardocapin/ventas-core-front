import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ITableColumn } from 'src/app/models/tableColumn.model';
import { ITotalFunctions } from 'src/app/models/totalFunctions.model';
import { ITableEvent, ITableSortEvent, ITableSelectionEvent } from 'src/app/models/tableEvents.model';

@Component({
  selector: 'mobentis-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() data: any[] = [];
  @Input() columns: ITableColumn[] = [];
  @Input() _id: string = '';
  @Input() parentAccordion: string = '';
  @Input() showFooter: boolean = false;
  @Input() totalFunctions?: ITotalFunctions;
  @Input() selectedIds: number[] = []; // Para checkboxes
  @Input() getId?: (item: any) => number; // Función para obtener el ID de un item
  @Input() sortColumn: string = ''; // Para ordenamiento
  @Input() sortDirection: 'asc' | 'desc' = 'asc'; // Para ordenamiento
  @Input() headerBackgroundColor: string = '#3f51b5'; // Color de fondo de la cabecera
  @Input() headerTextColor: string = 'white'; // Color del texto de la cabecera

  // Nuevos Outputs
  @Output() tableEvent = new EventEmitter<ITableEvent>();
  @Output() selectionChange = new EventEmitter<number[]>();
  @Output() sortChange = new EventEmitter<ITableSortEvent>();
  @Output() action = new EventEmitter<{ type: string, data: any }>();
  @Output() columnPinChange = new EventEmitter<{ column: ITableColumn, sticky: 'left' | 'right' | 'none' }>();
  @Output() columnVisibilityChange = new EventEmitter<{ column: ITableColumn, visible: boolean }>();
  @Output() columnOrderChange = new EventEmitter<ITableColumn[]>();

  // Referencia a la tabla
  @ViewChild('tableElement', { static: false }) tableElement?: ElementRef<HTMLTableElement>;

  visibleColumnsCache: ITableColumn[] = [];
  hideableColumnsCache: ITableColumn[] = [];
  private stickyCalculationScheduled = false;


  // Estado para drag and drop
  draggedColumn: ITableColumn | null = null;
  dragOverIndex: number = -1;

  // Estado para resize
  resizingColumn: ITableColumn | null = null;
  resizeStartX: number = 0;
  resizeStartWidth: number = 0;
  isResizing: boolean = false;

  // Listeners globales para resize
  private resizeMoveListener?: (event: MouseEvent) => void;
  private resizeEndListener?: (event: MouseEvent) => void;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
    if (!this._id) {
      this._id = 'table_' + Math.random().toString(36).substr(2, 9);
    }
    this.initializeColumnDefaults();
  }

  ngAfterViewInit() {
    // Calcular posiciones sticky después de que la vista se inicialice
    this.calculateStickyPositions();
    // Inicializar tooltips de Bootstrap
    this.initializeTooltips();
  }

  private initializeTooltips(): void {
    // Usar setTimeout para asegurar que el DOM esté completamente renderizado
    setTimeout(() => {
      const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((element) => {
        // Verificar si Bootstrap está disponible
        if (typeof (window as any).bootstrap !== 'undefined') {
          new (window as any).bootstrap.Tooltip(element);
        }
      });
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.initializeColumnDefaults();
    }

    if (changes['columns'] || changes['data']) {
      this.updateColumnCaches();
      if (this.tableElement) {
        setTimeout(() => {
          this.calculateStickyPositions();
          this.initializeTooltips();
        }, 100);
      }
    }

    // Forzar detección de cambios cuando cambian los selectedIds (importante para OnPush)
    if (changes['selectedIds']) {
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy() {
    // Limpiar listeners de resize
    if (this.resizeMoveListener) {
      document.removeEventListener('mousemove', this.resizeMoveListener);
    }
    if (this.resizeEndListener) {
      document.removeEventListener('mouseup', this.resizeEndListener);
    }
    // Limpiar timeout de resize de ventana
    if ((this as any).resizeTimeout) {
      clearTimeout((this as any).resizeTimeout);
    }
  }

  // Listener para redimensionamiento de ventana - recalcular posiciones sticky
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    // Solo recalcular si la pantalla es mayor a 992px (donde las sticky están activas)
    if (window.innerWidth > 992) {
      // Usar debounce para evitar cálculos excesivos durante el resize
      clearTimeout((this as any).resizeTimeout);
      (this as any).resizeTimeout = setTimeout(() => {
        this.calculateStickyPositions();
      }, 100);
    }
  }

  // Inicializar valores por defecto de las columnas
  initializeColumnDefaults(): void {
    this.columns.forEach(column => {
      // Valores por defecto para pinable
      if (column.pinable === undefined) {
        column.pinable = column.type !== 'acciones';
      }

      // Valores por defecto para hideable
      if (column.hideable === undefined) {
        column.hideable = true;
      }

      // Valores por defecto para visible
      if (column.visible === undefined) {
        column.visible = true;
      }

      // Valores por defecto para resizable
      if (column.resizable === undefined) {
        column.resizable = false;
      }

      // Asegurar que width, minWidth, maxWidth estén en formato 'px' si son números
      if (column.width && typeof column.width === 'number') {
        column.width = `${column.width}px`;
      }
      if (column.minWidth && typeof column.minWidth === 'number') {
        column.minWidth = `${column.minWidth}px`;
      }
      if (column.maxWidth && typeof column.maxWidth === 'number') {
        column.maxWidth = `${column.maxWidth}px`;
      }

      // Valores por defecto para useGrouping
      if (column.useGrouping === undefined) {
        column.useGrouping = column.type === 'number' || column.type === 'currency' || column.type === 'objetivo-monetario';
      }
    });
    this.updateColumnCaches();
  }

  private updateColumnCaches(): void {
    const visible = this.columns.filter(col => col.visible !== false);

    const stickyLeft = visible.filter(col => col.sticky === 'left');
    const notSticky = visible.filter(col => !col.sticky || col.sticky === 'none');
    const stickyRight = visible.filter(col => col.sticky === 'right');
    this.visibleColumnsCache = [...stickyLeft, ...notSticky, ...stickyRight];

    this.hideableColumnsCache = this.columns.filter(col => col.hideable === true);
  }

  // Métodos para checkboxes
  private getIdValue(item: any): number {
    if (this.getId) {
      return this.getId(item);
    }
    return item.id;
  }

  isItemSelected(item: any): boolean {
    const itemId = this.getIdValue(item);
    return this.selectedIds.includes(itemId);
  }

  toggleItemSelection(item: any, event: any): void {
    const itemId = this.getIdValue(item);
    let nextSelected = [...this.selectedIds];

    if (event.target.checked) {
      if (!nextSelected.includes(itemId)) {
        nextSelected = [...nextSelected, itemId];
      }
    } else {
      nextSelected = nextSelected.filter(id => id !== itemId);
    }

    this.selectedIds = nextSelected;
    this.selectionChange.emit(nextSelected);
  }

  toggleAllSelection(event: any): void {
    const visibleIds = this.data.map(item => this.getIdValue(item));
    let nextSelected: number[];

    if (event.target.checked) {
      // Seleccionar todos los items visibles (añadir a los ya seleccionados)
      nextSelected = Array.from(new Set([...this.selectedIds, ...visibleIds]));
    } else {
      // Deseleccionar solo los items visibles (mantener los de otras páginas)
      nextSelected = this.selectedIds.filter(id => !visibleIds.includes(id));
    }

    this.selectedIds = nextSelected;
    this.selectionChange.emit(nextSelected);
  }

  isAllSelected(): boolean {
    if (!this.data.length) return false;
    const visibleIds = this.data.map(item => this.getIdValue(item));
    return visibleIds.every(id => this.selectedIds.includes(id));
  }

  isSomeSelected(): boolean {
    if (!this.data.length) return false;
    const visibleIds = this.data.map(item => this.getIdValue(item));
    return visibleIds.some(id => this.selectedIds.includes(id)) && !this.isAllSelected();
  }

  // Método para verificar si hay columnas sticky en el footer
  hasStickyColumns(): boolean {
    return this.columns.some(column => column.sticky === 'left');
  }

  // Métodos para ordenamiento
  onSort(column: ITableColumn): void {
    if (!column.sortable) return;

    let newSortDirection: 'asc' | 'desc' = 'asc';

    if (this.sortColumn === column.field) {
      newSortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    }

    this.sortChange.emit({
      sortColumn: column.field,
      sortDirection: newSortDirection
    });
  }

  // Método para ordenar desde el menú de opciones
  onSortOption(column: ITableColumn, direction: 'asc' | 'desc' | 'none', event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (!column.sortable) return;

    if (direction === 'none') {
      // Quitar ordenación
      this.sortChange.emit({
        sortColumn: '',
        sortDirection: 'asc'
      });
    } else {
      // Si ya está ordenado por esta columna y en la misma dirección, quitar ordenación
      if (this.sortColumn === column.field && this.sortDirection === direction) {
        this.sortChange.emit({
          sortColumn: '',
          sortDirection: 'asc'
        });
      } else {
        // Aplicar ordenación
        this.sortChange.emit({
          sortColumn: column.field,
          sortDirection: direction
        });
      }
    }
  }

  getSortIcon(column: ITableColumn): string {
    if (this.sortColumn !== column.field) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  // Métodos para fijar/desfijar columnas
  onPin(column: ITableColumn, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    const currentSticky = column.sticky || 'none';

    // Solo permitir fijar a la izquierda: none -> left -> none
    // Si está fijada a la derecha, permitir desfijar: right -> none
    let newSticky: 'left' | 'right' | 'none';
    if (currentSticky === 'right') {
      // Si está fijada a la derecha, desfijar
      newSticky = 'none';
    } else if (currentSticky === 'left') {
      // Si está fijada a la izquierda, desfijar
      newSticky = 'none';
    } else {
      // Si no está fijada, fijar a la izquierda
      newSticky = 'left';
    }

    this.applyPinChange(column, newSticky);
  }

  // Método para fijar desde el menú de opciones
  onPinOption(column: ITableColumn, position: 'left' | 'right' | 'none', event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.applyPinChange(column, position);
  }

  // Método auxiliar para aplicar cambios de fijación
  private applyPinChange(column: ITableColumn, newSticky: 'left' | 'right' | 'none'): void {
    // Actualizar la propiedad directamente
    column.sticky = newSticky;

    // Si se fija la columna, reordenar automáticamente para que esté en el grupo de fijas
    if (newSticky === 'left') {
      this.reorderColumnToStickyGroup(column);
    } else if (newSticky === 'right') {
      this.reorderColumnToRightStickyGroup(column);
    } else if (newSticky === 'none') {
      this.reorderColumnToNotStickyGroup(column);
    }

    // Emitir el cambio primero
    this.columnPinChange.emit({ column, sticky: newSticky });
    this.columnOrderChange.emit([...this.columns]); // Emitir nuevo orden

    this.updateColumnCaches();
    this.cdr.markForCheck();

    // Recalcular posiciones después de cambiar el estado
    this.scheduleStickyCalculation();
  }

  // Reordenar columna al grupo de fijas a la derecha
  reorderColumnToRightStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;

    // Encontrar el último índice de columna fija a la derecha
    let lastRightStickyIndex = -1;
    for (let i = this.columns.length - 1; i >= 0; i--) {
      if (this.columns[i].sticky === 'right') {
        lastRightStickyIndex = i;
        break;
      }
    }

    // Si no hay columnas fijas a la derecha, ponerla al final
    if (lastRightStickyIndex === -1) {
      // Encontrar el último índice antes de la columna de control (si existe)
      lastRightStickyIndex = this.columns.length - 1;
    }

    // Si ya está en el grupo correcto (después del último fijado a la derecha), no hacer nada
    if (currentIndex > lastRightStickyIndex) {
      return;
    }

    // Mover la columna a la izquierda del último fijado a la derecha (o al final si no hay ninguno)
    this.columns.splice(currentIndex, 1);
    this.columns.splice(lastRightStickyIndex + 1, 0, column);
  }

  // Reordenar columna al grupo de fijas (al final de las fijas)
  reorderColumnToStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;

    // Encontrar el último índice de columna fija a la izquierda
    let lastStickyIndex = -1;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].sticky === 'left') {
        lastStickyIndex = i;
      }
    }

    // Si ya está en el grupo correcto, no hacer nada
    if (currentIndex <= lastStickyIndex) {
      return;
    }

    // Mover la columna al final del grupo de fijas
    this.columns.splice(currentIndex, 1);
    this.columns.splice(lastStickyIndex + 1, 0, column);
  }

  // Reordenar columna al grupo de no fijas (al final de las no fijas, antes de las fijas a la derecha)
  reorderColumnToNotStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;

    // Encontrar el primer índice de columna fija a la derecha (o el final si no hay)
    let firstRightStickyIndex = this.columns.length;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].sticky === 'right') {
        firstRightStickyIndex = i;
        break;
      }
    }

    // Encontrar el último índice de columna no fija
    let lastNotStickyIndex = -1;
    for (let i = 0; i < firstRightStickyIndex; i++) {
      if (this.columns[i].sticky !== 'left') {
        lastNotStickyIndex = i;
      }
    }

    // Si ya está en el grupo correcto, no hacer nada
    if (currentIndex > lastNotStickyIndex && currentIndex < firstRightStickyIndex) {
      return;
    }

    // Mover la columna al final del grupo de no fijas
    this.columns.splice(currentIndex, 1);
    this.columns.splice(lastNotStickyIndex + 1, 0, column);
  }

  getPinIcon(column: ITableColumn): string {
    if (column.sticky === 'left' || column.sticky === 'right') {
      return 'bi bi-pin-angle-fill';
    }
    return 'bi bi-pin-angle';
  }

  getPinTitle(column: ITableColumn): string {
    if (column.sticky === 'left') {
      return 'Desfijar columna';
    }
    return 'Fijar columna';
  }

  isPinable(column: ITableColumn): boolean {
    return column.pinable !== false && column.type !== 'acciones';
  }

  // Obtener columnas visibles (filtradas y reordenadas)
  get visibleColumns(): ITableColumn[] {
    return this.visibleColumnsCache;
  }

  // TrackBy para optimizar ngFor
  trackByColumnField(index: number, column: ITableColumn): string {
    return column.field;
  }

  trackByRow(index: number, item: any): any {
    return item?.id ?? index;
  }

  // Obtener columnas que pueden ser ocultadas (solo las que tienen hideable === true)
  get hideableColumns(): ITableColumn[] {
    return this.hideableColumnsCache;
  }

  // Manejar cambio de checkbox individual
  onColumnCheckboxChange(column: ITableColumn, event: Event): void {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    const newVisible = target.checked;

    // Solo actualizar si el estado es diferente
    if (column.visible !== newVisible) {
      column.visible = newVisible;
      this.columnVisibilityChange.emit({ column, visible: newVisible });
      this.updateColumnCaches();

      // Solicitar actualización del template
      this.cdr.markForCheck();
      this.scheduleStickyCalculation();
    }
  }

  // Manejar click en el label
  onColumnLabelClick(column: ITableColumn, event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    // Toggle del checkbox programáticamente
    const checkbox = document.getElementById('col-' + column.field) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      const changeEvent = new Event('change', { bubbles: true });
      checkbox.dispatchEvent(changeEvent);
    }
  }

  // Toggle visibilidad de una columna (método original, mantenido por compatibilidad)
  toggleColumnVisibility(column: ITableColumn, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Solo se pueden ocultar/mostrar columnas con hideable === true
    if (column.hideable !== true) {
      return; // No se puede ocultar
    }

    // Obtener el estado actual antes de cambiar
    const currentVisible = column.visible !== false;

    // Cambiar el estado
    column.visible = !currentVisible;

    // Emitir el evento
    this.columnVisibilityChange.emit({ column, visible: column.visible });
    this.updateColumnCaches();

    // Solicitar actualización del template
    this.cdr.markForCheck();
    this.scheduleStickyCalculation();
  }

  // Helper para toggle all columns (ya no se usa, pero se mantiene por compatibilidad)
  onToggleAllColumns(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.toggleAllColumns(target.checked);
  }

  // Toggle todas las columnas ocultables
  toggleAllColumns(show: boolean): void {
    const hideableColumns = this.hideableColumns;
    hideableColumns.forEach(column => {
      if (column.visible !== show) {
        column.visible = show;
        this.columnVisibilityChange.emit({ column, visible: show });
      }
    });
    this.updateColumnCaches();
    this.cdr.markForCheck();

    // Recalcular posiciones sticky después de mostrar/ocultar todas
    this.scheduleStickyCalculation();
  }

  // Verificar si todas las columnas ocultables están visibles
  areAllColumnsVisible(): boolean {
    const hideableColumns = this.hideableColumns;
    return hideableColumns.length > 0 && hideableColumns.every(col => col.visible !== false);
  }

  // Verificar si todas las columnas ocultables están ocultas
  areAllColumnsHidden(): boolean {
    const hideableColumns = this.hideableColumns;
    return hideableColumns.length > 0 && hideableColumns.every(col => col.visible === false);
  }

  // Métodos para drag and drop
  isDraggable(column: ITableColumn): boolean {
    return column.visible !== false;
  }

  // Verificar si dos columnas pueden ser reordenadas entre sí
  canReorderColumns(dragged: ITableColumn | null, target: ITableColumn): boolean {
    if (!dragged) return false;

    // Función auxiliar para determinar si una columna es "no sticky"
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };

    // Permitir reordenar si:
    // 1. Están en el mismo grupo sticky (ambas left, ambas right, o ambas none)
    // 2. Ambas son "no sticky" (pueden moverse entre sí)
    const draggedIsNonSticky = isNonSticky(dragged);
    const targetIsNonSticky = isNonSticky(target);

    return dragged.sticky === target.sticky || (draggedIsNonSticky && targetIsNonSticky);
  }

  onDragStart(column: ITableColumn, event: DragEvent): void {
    this.draggedColumn = column;
    this.dragOverIndex = -1;

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', column.field);
    }

    // Crear una imagen de arrastre personalizada (solo la celda)
    const th = event.currentTarget as HTMLElement;
    const clone = th.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.top = '-9999px';
    clone.style.opacity = '0.8';
    clone.style.border = '1px solid #3f51b5';
    clone.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    clone.style.transform = 'rotate(2deg)';
    clone.style.backgroundColor = '#fff';
    document.body.appendChild(clone);

    if (event.dataTransfer) {
      event.dataTransfer.setDragImage(clone, event.offsetX, event.offsetY);
    }

    // Remover el clon después de un breve delay
    setTimeout(() => {
      document.body.removeChild(clone);
    }, 0);

    // Agregar clase dragging
    th.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
  }

  onDragOver(event: DragEvent, targetColumn: ITableColumn, index: number): void {
    event.preventDefault();

    if (!this.draggedColumn) return;

    // Función auxiliar para determinar si una columna es "no sticky"
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };

    // Permitir reordenar si:
    // 1. Están en el mismo grupo sticky (ambas left, ambas right, o ambas none)
    // 2. Ambas son "no sticky" (pueden moverse entre sí)
    const draggedIsNonSticky = isNonSticky(this.draggedColumn);
    const targetIsNonSticky = isNonSticky(targetColumn);

    if (this.draggedColumn.sticky === targetColumn.sticky || (draggedIsNonSticky && targetIsNonSticky)) {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'move';
      }
      this.dragOverIndex = index;
    } else {
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'none';
      }
      this.dragOverIndex = -1;
    }
  }

  onDragLeave(event: DragEvent): void {
    this.dragOverIndex = -1;
  }

  onDrop(event: DragEvent, targetColumn: ITableColumn, targetIndex: number): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.draggedColumn) return;

    // Función auxiliar para determinar si una columna es "no sticky"
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };

    // Permitir reordenar si:
    // 1. Están en el mismo grupo sticky (ambas left, ambas right, o ambas none)
    // 2. Ambas son "no sticky" (pueden moverse entre sí)
    const draggedIsNonSticky = isNonSticky(this.draggedColumn);
    const targetIsNonSticky = isNonSticky(targetColumn);

    if (this.draggedColumn.sticky !== targetColumn.sticky && !(draggedIsNonSticky && targetIsNonSticky)) {
      return;
    }

    const draggedIndex = this.columns.indexOf(this.draggedColumn);
    const targetColIndex = this.columns.indexOf(targetColumn);

    if (draggedIndex === -1 || targetColIndex === -1) return;

    // Reordenar en el array de columnas
    this.columns.splice(draggedIndex, 1);
    this.columns.splice(targetColIndex, 0, this.draggedColumn);

    // Emitir el cambio
    this.columnOrderChange.emit([...this.columns]);

    // Recalcular posiciones
    this.updateColumnCaches();
    this.scheduleStickyCalculation();

    this.draggedColumn = null;
    this.dragOverIndex = -1;
    this.cdr.markForCheck();
  }

  onDragEnd(event: DragEvent): void {
    const th = event.currentTarget as HTMLElement;
    th.classList.remove('dragging');
    document.body.style.cursor = '';

    this.draggedColumn = null;
    this.dragOverIndex = -1;
  }

  // Métodos para resize
  isResizable(column: ITableColumn): boolean {
    return column.resizable === true && column.visible !== false;
  }

  onResizeStart(column: ITableColumn, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.isResizing = true;
    this.resizingColumn = column;
    this.resizeStartX = event.clientX;

    // Obtener ancho actual de la columna
    const th = (event.target as HTMLElement).closest('th') as HTMLElement;
    if (th) {
      this.resizeStartWidth = th.offsetWidth;
    }

    // Agregar listeners globales
    this.resizeMoveListener = (e: MouseEvent) => this.onResizeMove(e);
    this.resizeEndListener = (e: MouseEvent) => this.onResizeEnd(e);

    document.addEventListener('mousemove', this.resizeMoveListener);
    document.addEventListener('mouseup', this.resizeEndListener);

    // Prevenir selección de texto durante el resize
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }

  onResizeMove = (event: MouseEvent): void => {
    if (!this.isResizing || !this.resizingColumn) return;

    const deltaX = event.clientX - this.resizeStartX;
    const newWidth = this.resizeStartWidth + deltaX;

    // Aplicar límites min y max
    let minWidth = 50; // Mínimo por defecto
    let maxWidth = Infinity;

    if (this.resizingColumn.minWidth) {
      const minWidthStr = this.resizingColumn.minWidth.toString();
      if (minWidthStr.includes('px')) {
        minWidth = parseInt(minWidthStr, 10);
      } else if (!minWidthStr.includes('%') && !minWidthStr.includes('rem') && !minWidthStr.includes('em')) {
        minWidth = parseInt(minWidthStr, 10);
      }
    }

    if (this.resizingColumn.maxWidth) {
      const maxWidthStr = this.resizingColumn.maxWidth.toString();
      if (maxWidthStr.includes('px')) {
        maxWidth = parseInt(maxWidthStr, 10);
      } else if (!maxWidthStr.includes('%') && !maxWidthStr.includes('rem') && !maxWidthStr.includes('em')) {
        maxWidth = parseInt(maxWidthStr, 10);
      }
    }

    const finalWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

    // Actualizar el ancho de la columna
    this.resizingColumn.width = `${finalWidth}px`;

    // Recalcular posiciones sticky
    this.scheduleStickyCalculation();
    this.cdr.markForCheck();
  }

  onResizeEnd = (event: MouseEvent): void => {
    if (!this.isResizing) return;

    this.isResizing = false;
    this.resizingColumn = null;

    // Remover listeners
    if (this.resizeMoveListener) {
      document.removeEventListener('mousemove', this.resizeMoveListener);
      this.resizeMoveListener = undefined;
    }
    if (this.resizeEndListener) {
      document.removeEventListener('mouseup', this.resizeEndListener);
      this.resizeEndListener = undefined;
    }

    // Restaurar estilos del body
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    // Recalcular posiciones sticky
    this.scheduleStickyCalculation();
  }

  // Obtener ancho de una columna
  getColumnWidth(column: ITableColumn, index: number): number {
    if (!this.tableElement) {
      // Si no hay referencia a la tabla, usar valores por defecto
      return this.getDefaultColumnWidth(column);
    }

    const table = this.tableElement.nativeElement;
    const headerCells = table.querySelectorAll('thead th');
    const visibleColumns = this.visibleColumns;
    const visibleIndex = visibleColumns.indexOf(column);

    if (visibleIndex >= 0 && visibleIndex < headerCells.length) {
      const cell = headerCells[visibleIndex] as HTMLElement;
      const width = cell.getBoundingClientRect().width || cell.offsetWidth;
      if (width > 0) {
        return width;
      }
    }

    // Si no se puede obtener del DOM, usar width, minWidth o valores por defecto
    if (column.width) {
      const widthStr = column.width.toString();
      if (widthStr.includes('px')) {
        const widthValue = parseInt(widthStr, 10);
        if (!isNaN(widthValue) && widthValue > 0) {
          return widthValue;
        }
      } else if (!widthStr.includes('%') && !widthStr.includes('rem') && !widthStr.includes('em')) {
        const widthValue = parseInt(widthStr, 10);
        if (!isNaN(widthValue) && widthValue > 0) {
          return widthValue;
        }
      }
    }

    if (column.minWidth) {
      const minWidthStr = column.minWidth.toString();
      if (minWidthStr.includes('px')) {
        const minWidthValue = parseInt(minWidthStr, 10);
        if (!isNaN(minWidthValue) && minWidthValue > 0) {
          return minWidthValue;
        }
      } else if (!minWidthStr.includes('%') && !minWidthStr.includes('rem') && !minWidthStr.includes('em')) {
        const minWidthValue = parseInt(minWidthStr, 10);
        if (!isNaN(minWidthValue) && minWidthValue > 0) {
          return minWidthValue;
        }
      }
    }

    return this.getDefaultColumnWidth(column);
  }

  getDefaultColumnWidth(column: ITableColumn): number {
    // Anchos por defecto según el tipo
    if (column.type === 'checkbox') {
      return 50;
    }
    if (column.type === 'acciones') {
      return 100;
    }
    if (column.type === 'date') {
      return 120;
    }
    if (column.type === 'number' || column.type === 'currency') {
      return 100;
    }

    // Ancho por defecto para columnas de texto
    return 150;
  }

  // Obtener el ancho de la columna de control de columnas
  getColumnsControlWidth(): number {
    return 40; // Ancho mínimo para el botón de columnas
  }

  // Calcular la posición left acumulada para columnas fijadas a la izquierda
  getStickyLeftPosition(column: ITableColumn, columnIndex: number): number {
    let leftPosition = 0;

    // Recorrer todas las columnas anteriores que están fijadas a la izquierda y visibles
    for (let i = 0; i < columnIndex; i++) {
      const prevColumn = this.columns[i];
      // Solo considerar columnas visibles y fijadas a la izquierda
      if (prevColumn.visible !== false && prevColumn.sticky === 'left') {
        const width = this.getColumnWidth(prevColumn, i);
        leftPosition += width;
      }
    }

    // Ajuste especial: si es checkbox y es la primera columna sticky, usar -1px como en el CSS
    // Solo aplicar el ajuste si no hay columnas sticky anteriores (leftPosition === 0)
    if (column.type === 'checkbox' && column.sticky === 'left' && leftPosition === 0) {
      return -1;
    }

    return leftPosition;
  }

  // Calcular la posición right acumulada para columnas fijadas a la derecha
  getStickyRightPosition(column: ITableColumn, columnIndex: number): number {
    let rightPosition = 0;

    // Primero sumar el ancho de la columna de control de columnas (siempre está al final a la derecha)
    rightPosition += this.getColumnsControlWidth();

    // Recorrer todas las columnas posteriores que están fijadas a la derecha y visibles
    for (let i = columnIndex + 1; i < this.columns.length; i++) {
      const nextColumn = this.columns[i];
      // Solo considerar columnas visibles y fijadas a la derecha
      if (nextColumn.visible !== false && nextColumn.sticky === 'right') {
        rightPosition += this.getColumnWidth(nextColumn, i);
      }
    }

    return rightPosition;
  }

  // Calcular y aplicar posiciones sticky dinámicamente
  calculateStickyPositions(): void {
    this.scheduleStickyCalculation();
  }

  private scheduleStickyCalculation(): void {
    if (this.stickyCalculationScheduled) {
      return;
    }

    this.stickyCalculationScheduled = true;
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.stickyCalculationScheduled = false;
        this.calculateStickyPositionsInternal();
      });
    });
  }

  private calculateStickyPositionsInternal(): void {
    if (!this.tableElement) {
      return;
    }

    const table = this.tableElement.nativeElement;
    const headerCells = table.querySelectorAll('thead th');
    if (!headerCells.length) {
      return;
    }

    // Verificar que las celdas tengan ancho antes de calcular posiciones
    let allCellsHaveWidth = true;
    headerCells.forEach((cell: Element) => {
      const htmlCell = cell as HTMLElement;
      if (htmlCell.offsetWidth === 0) {
        allCellsHaveWidth = false;
      }
    });

    if (!allCellsHaveWidth) {
      this.scheduleStickyCalculation();
      return;
    }

    const bodyRows = table.querySelectorAll('tbody tr');
    const footerCells = table.querySelectorAll('tfoot td');
    const visibleColumns = this.visibleColumns;

    // La última celda es la columna de control, establecer su posición
    const lastHeaderIndex = headerCells.length - 1;
    if (headerCells[lastHeaderIndex]) {
      const controlCell = headerCells[lastHeaderIndex] as HTMLElement;
      controlCell.style.right = '0px';
    }

    // Actualizar posiciones en el header (la última es la columna de control)
    headerCells.forEach((cell: Element, cellIndex: number) => {
      // Saltar la última columna (control de columnas)
      if (cellIndex === lastHeaderIndex) return;

      const column = visibleColumns[cellIndex];
      if (!column) return;

      // Obtener el índice real de la columna en el array completo (columns)
      const realIndex = this.columns.indexOf(column);
      if (realIndex === -1) return;

      const htmlCell = cell as HTMLElement;

      // Limpiar estilos previos
      htmlCell.style.left = '';
      htmlCell.style.right = '';

      if (column.sticky === 'left') {
        // Para columnas fijas a la izquierda, calcular posición basada en el orden en columns
        const leftPos = this.getStickyLeftPosition(column, realIndex);
        htmlCell.style.left = `${leftPos}px`;
      } else if (column.sticky === 'right') {
        // Para columnas fijas a la derecha, calcular posición basada en el orden en columns
        const rightPos = this.getStickyRightPosition(column, realIndex);
        htmlCell.style.right = `${rightPos}px`;
      }
    });

    // Actualizar posiciones en el body
    bodyRows.forEach((row: Element) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell: Element, cellIndex: number) => {
        // Saltar la última celda (control de columnas)
        if (cellIndex === cells.length - 1) return;

        const column = visibleColumns[cellIndex];
        if (!column) return;

        const realIndex = this.columns.indexOf(column);
        if (realIndex === -1) return;

        const htmlCell = cell as HTMLElement;

        // Limpiar estilos previos
        htmlCell.style.left = '';
        htmlCell.style.right = '';

        if (column.sticky === 'left') {
          const leftPos = this.getStickyLeftPosition(column, realIndex);
          htmlCell.style.left = `${leftPos}px`;
        } else if (column.sticky === 'right') {
          const rightPos = this.getStickyRightPosition(column, realIndex);
          htmlCell.style.right = `${rightPos}px`;
        }
      });
    });

    // Actualizar posiciones en el footer
    footerCells.forEach((cell: Element, cellIndex: number) => {
      // Saltar la última celda (control de columnas)
      if (cellIndex === footerCells.length - 1) return;

      const column = visibleColumns[cellIndex];
      if (!column) return;

      const realIndex = this.columns.indexOf(column);
      if (realIndex === -1) return;

      const htmlCell = cell as HTMLElement;

      // Limpiar estilos previos
      htmlCell.style.left = '';
      htmlCell.style.right = '';

      if (column.sticky === 'left') {
        const leftPos = this.getStickyLeftPosition(column, realIndex);
        htmlCell.style.left = `${leftPos}px`;
      } else if (column.sticky === 'right') {
        const rightPos = this.getStickyRightPosition(column, realIndex);
        htmlCell.style.right = `${rightPos}px`;
      }
    });
  }

  // Métodos para acciones
  onAction(actionType: string, item: any): void {
    this.action.emit({ type: actionType, data: item });
  }

  /* formatos */
  formatearMoneda(valor: number | string | null | undefined, column?: ITableColumn): string {
    // Convertir el valor a número
    let numValue: number;

    if (valor === null || valor === undefined) {
      numValue = 0;
    } else if (typeof valor === 'string') {
      // Limpiar el string y convertir
      const cleaned = valor.trim().replace(/[^\d.,-]/g, '');
      const parsed = parseFloat(cleaned.replace(',', '.'));
      numValue = isNaN(parsed) ? 0 : parsed;
    } else if (typeof valor === 'number') {
      numValue = isNaN(valor) ? 0 : valor;
    } else {
      numValue = 0;
    }

    // Formatear manualmente con 2 decimales
    const isNegative = numValue < 0;
    const absValue = Math.abs(numValue);

    // Redondear a 2 decimales
    const rounded = Math.round(absValue * 100) / 100;

    // Separar parte entera y decimal
    const parts = rounded.toString().split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // Asegurar 2 decimales
    decimalPart = decimalPart.padEnd(2, '0').substring(0, 2);

    // Agregar separador de miles (punto) cada 3 dígitos si grouping está habilitado
    if (column && column.useGrouping !== false) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Construir el resultado
    let result = integerPart + ',' + decimalPart;

    // Agregar signo negativo si es necesario
    if (isNegative) {
      result = '-' + result;
    }

    // Agregar símbolo de euro
    result += ' €';

    return result;
  }

  formatearNumero(valor: number | null | undefined, decimalPlaces: number = 0, useGrouping: boolean = true): string {
    // Convertir el valor a número
    let numValue: number;

    if (valor === null || valor === undefined) {
      numValue = 0;
    } else if (typeof valor === 'string') {
      // Limpiar el string y convertir
      const cleaned = (valor as string).trim().replace(/[^\d.,-]/g, '');
      const parsed = parseFloat(cleaned.replace(',', '.'));
      numValue = isNaN(parsed) ? 0 : parsed;
    } else if (typeof valor === 'number') {
      numValue = isNaN(valor) ? 0 : valor;
    } else {
      numValue = 0;
    }

    // Si el valor es 0 y no hay decimales, retornar "0"
    if (numValue === 0 && decimalPlaces === 0) {
      return '0';
    }

    // Formatear manualmente
    const isNegative = numValue < 0;
    const absValue = Math.abs(numValue);

    // Redondear a los decimales especificados
    const multiplier = Math.pow(10, decimalPlaces);
    const rounded = Math.round(absValue * multiplier) / multiplier;

    // Separar parte entera y decimal
    const parts = rounded.toString().split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';

    // Ajustar decimales
    if (decimalPlaces > 0) {
      decimalPart = decimalPart.padEnd(decimalPlaces, '0').substring(0, decimalPlaces);
    } else {
      decimalPart = '';
    }

    // Agregar separador de miles (punto) cada 3 dígitos si grouping está habilitado
    if (useGrouping !== false) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Construir el resultado
    let result = integerPart;
    if (decimalPlaces > 0) {
      result += ',' + decimalPart;
    }

    // Agregar signo negativo si es necesario
    if (isNegative) {
      result = '-' + result;
    }

    return result;
  }

  shouldShowTotal(column: ITableColumn): boolean {
    return column.totalizable === true &&
      this.showFooter &&
      this.totalFunctions !== undefined &&
      this.totalFunctions[column.field] !== undefined;
  }

  hasTotalizableColumns(): boolean {
    if (!this.showFooter || !this.totalFunctions) {
      return false;
    }
    return this.visibleColumns.some(col =>
      col.totalizable === true &&
      this.totalFunctions &&
      this.totalFunctions[col.field] !== undefined
    );
  }

  calculateColumnTotal(column: ITableColumn): string {
    if (!this.totalFunctions || !this.totalFunctions[column.field]) {
      return '-';
    }

    const total = this.totalFunctions[column.field](this.data);

    if (column.type === 'currency') {
      return this.formatearMoneda(total, column);
    } else if (column.type === 'number') {
      return this.formatearNumero(total, column.decimalPlaces ?? 0, column.useGrouping ?? true);
    }

    return total.toString();
  }

  /**
   * Obtiene el valor de una celda, manejando campos anidados
   */
  getCellValue(row: any, field: string): any {
    if (field.includes('.')) {
      const parts = field.split('.');
      let value = row;
      for (const part of parts) {
        value = value?.[part];
        if (value === undefined || value === null) break;
      }
      return value;
    }
    return row[field];
  }

  /**
   * Maneja el error cuando una imagen no se puede cargar
   */
  onImageError(event: any): void {
    event.target.src = 'assets/images/user.png';
  }
}
