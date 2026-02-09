import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, AfterViewInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { ITableColumn } from 'src/app/models/tableColumn.model';

/**
 * Interfaz para la configuraci?n de la fila de nuevo elemento
 */
export interface INewRowConfig {
  /** Campos editables para la nueva fila */
  fields: {
    field: string;
    placeholder?: string;
    type?: 'text' | 'number' | 'select';
    options?: any[]; // Para campos select
    displayField?: string; // Campo a mostrar en select
    valueField?: string; // Campo para el valor en select
  }[];
  /** Texto del bot?n de guardar */
  saveButtonText?: string;
  /** Texto del bot?n de cancelar */
  cancelButtonText?: string;
}

/**
 * Componente de tabla especializado para popups con soporte de edici?n inline
 * y fila para agregar nuevos elementos.
 * 
 * Basado en el componente table.component pero optimizado para uso en popups.
 */
@Component({
  selector: 'mobentis-table-popup',
  templateUrl: './table-popup.component.html',
  styleUrls: ['./table-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TablePopupComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // Inputs b?sicos
  @Input() data: any[] = [];
  @Input() columns: ITableColumn[] = [];
  @Input() _id: string = '';
  @Input() sortColumn: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() headerBackgroundColor: string = '#3f51b5';
  @Input() headerTextColor: string = 'white';
  @Input() getId?: (item: any) => number;

  // Inputs para edici?n inline
  @Input() editingItemId: number | null = null;
  @Input() showNewRow: boolean = true; // Mostrar fila para agregar nuevos elementos
  @Input() newRowConfig?: INewRowConfig; // Configuraci?n de la fila de nuevo elemento
  @Input() enableRowClickForSuppliers: boolean = false; // Habilitar click en fila para mostrar proveedores

  // Outputs
  @Output() sortChange = new EventEmitter<{ sortColumn: string, sortDirection: 'asc' | 'desc' }>();
  @Output() action = new EventEmitter<{ type: string, data: any }>();
  @Output() columnPinChange = new EventEmitter<{ column: ITableColumn, sticky: 'left' | 'right' | 'none' }>();
  @Output() columnVisibilityChange = new EventEmitter<{ column: ITableColumn, visible: boolean }>();
  @Output() columnOrderChange = new EventEmitter<ITableColumn[]>();

  // Outputs para edici?n inline
  @Output() editableFieldChange = new EventEmitter<{ item: any, field: string, value: any }>();
  @Output() saveEdit = new EventEmitter<any>(); // Guardar edici?n de un item
  @Output() cancelEdit = new EventEmitter<void>(); // Cancelar edici?n
  @Output() saveNewItem = new EventEmitter<any>(); // Guardar nuevo item
  @Output() cancelNewItem = new EventEmitter<void>(); // Cancelar nuevo item

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

  // Estado para nuevo item
  newItemData: any = {};

  // Listeners globales para resize
  private resizeMoveListener?: (event: MouseEvent) => void;
  private resizeEndListener?: (event: MouseEvent) => void;

  constructor(private cdr: ChangeDetectorRef, private zone: NgZone) { }

  ngOnInit() {
    if (!this._id) {
      this._id = 'table_popup_' + Math.random().toString(36).substr(2, 9);
    }
    this.initializeColumnDefaults();
    this.initializeNewItemData();
  }

  ngAfterViewInit() {
    this.calculateStickyPositions();
    this.initializeTooltips();
  }

  private initializeTooltips(): void {
    setTimeout(() => {
      const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((element) => {
        if (typeof (window as any).bootstrap !== 'undefined') {
          new (window as any).bootstrap.Tooltip(element);
        }
      });
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']) {
      this.initializeColumnDefaults();
      this.initializeNewItemData();
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

    if (changes['newRowConfig']) {
      this.initializeNewItemData();
    }
  }

  ngOnDestroy() {
    if (this.resizeMoveListener) {
      document.removeEventListener('mousemove', this.resizeMoveListener);
    }
    if (this.resizeEndListener) {
      document.removeEventListener('mouseup', this.resizeEndListener);
    }
    if ((this as any).resizeTimeout) {
      clearTimeout((this as any).resizeTimeout);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    if (window.innerWidth > 992) {
      clearTimeout((this as any).resizeTimeout);
      (this as any).resizeTimeout = setTimeout(() => {
        this.calculateStickyPositions();
      }, 100);
    }
  }

  // Inicializar datos del nuevo item
  private initializeNewItemData(): void {
    this.newItemData = {};
    if (this.newRowConfig?.fields) {
      this.newRowConfig.fields.forEach(field => {
        this.newItemData[field.field] = '';
      });
    } else {
      // Inicializar con los campos de las columnas editables (usar defaultValue si existe)
      this.columns.forEach(col => {
        if (col.editable) {
          // Para campos de color, usar defaultValue o un valor por defecto v?lido
          if (col.inputType === 'color') {
            this.newItemData[col.field] = col.defaultValue || '#000000';
          } else {
            this.newItemData[col.field] = col.defaultValue !== undefined ? col.defaultValue : '';
          }
        }
      });
    }
  }

  // Obtener tipo de input para columna editable
  getInputType(column: ITableColumn): string {
    return column.inputType === 'color' ? 'color' : 'text';
  }

  // Obtener valor de color normalizado (siempre devuelve un valor v?lido)
  getColorValue(item: any, column: ITableColumn): string {
    const value = item?.[column.field];
    if (value && typeof value === 'string' && value.startsWith('#')) {
      return value;
    }
    return column.defaultValue || '#000000';
  }


  /** Limpiar datos del nuevo item (pblico para que el padre pueda llamarlo tras un create exitoso) */
  clearNewItemData(): void {
    this.initializeNewItemData();
    this.cdr.markForCheck();
  }

  // Se llama cuando cambia alg?n valor en el modelo (para OnPush)
  onModelChange(): void {
    this.cdr.markForCheck();
  }

  // Verificar si hay datos en el nuevo item
  hasNewItemData(): boolean {
    return Object.values(this.newItemData).some(value =>
      value !== null && value !== undefined && value !== ''
    );
  }

  // Guardar nuevo item
  onSaveNewItem(): void {
    if (this.hasNewItemData()) {
      this.saveNewItem.emit({ ...this.newItemData });
    }
  }

  // Cancelar nuevo item
  onCancelNewItem(): void {
    this.clearNewItemData();
    this.cancelNewItem.emit();
  }

  // Inicializar valores por defecto de las columnas
  initializeColumnDefaults(): void {
    this.columns.forEach(column => {
      if (column.pinable === undefined) {
        column.pinable = column.type !== 'acciones';
      }
      if (column.hideable === undefined) {
        column.hideable = true;
      }
      if (column.visible === undefined) {
        column.visible = true;
      }
      if (column.resizable === undefined) {
        column.resizable = false;
      }
      if (column.width && typeof column.width === 'number') {
        column.width = `${column.width}px`;
      }
      if (column.minWidth && typeof column.minWidth === 'number') {
        column.minWidth = `${column.minWidth}px`;
      }
      if (column.maxWidth && typeof column.maxWidth === 'number') {
        column.maxWidth = `${column.maxWidth}px`;
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

  // M?todos para obtener ID
  getIdValue(item: any): number {
    if (this.getId) {
      return this.getId(item);
    }
    return item.id;
  }

  // M?todos para ordenamiento
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

  onSortOption(column: ITableColumn, direction: 'asc' | 'desc' | 'none', event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (!column.sortable) return;
    if (direction === 'none') {
      this.sortChange.emit({ sortColumn: '', sortDirection: 'asc' });
    } else {
      if (this.sortColumn === column.field && this.sortDirection === direction) {
        this.sortChange.emit({ sortColumn: '', sortDirection: 'asc' });
      } else {
        this.sortChange.emit({ sortColumn: column.field, sortDirection: direction });
      }
    }
  }

  getSortIcon(column: ITableColumn): string {
    if (this.sortColumn !== column.field) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-up' : 'bi bi-arrow-down';
  }

  // M?todos para fijar/desfijar columnas
  onPin(column: ITableColumn, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    const currentSticky = column.sticky || 'none';
    let newSticky: 'left' | 'right' | 'none';
    if (currentSticky === 'right') {
      newSticky = 'none';
    } else if (currentSticky === 'left') {
      newSticky = 'none';
    } else {
      newSticky = 'left';
    }
    this.applyPinChange(column, newSticky);
  }

  onPinOption(column: ITableColumn, position: 'left' | 'right' | 'none', event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    this.applyPinChange(column, position);
  }

  private applyPinChange(column: ITableColumn, newSticky: 'left' | 'right' | 'none'): void {
    column.sticky = newSticky;
    if (newSticky === 'left') {
      this.reorderColumnToStickyGroup(column);
    } else if (newSticky === 'right') {
      this.reorderColumnToRightStickyGroup(column);
    } else if (newSticky === 'none') {
      this.reorderColumnToNotStickyGroup(column);
    }
    this.columnPinChange.emit({ column, sticky: newSticky });
    this.columnOrderChange.emit([...this.columns]);
    this.updateColumnCaches();
    this.cdr.markForCheck();
    this.scheduleStickyCalculation();
  }

  reorderColumnToRightStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;
    let lastRightStickyIndex = -1;
    for (let i = this.columns.length - 1; i >= 0; i--) {
      if (this.columns[i].sticky === 'right') {
        lastRightStickyIndex = i;
        break;
      }
    }
    if (lastRightStickyIndex === -1) {
      lastRightStickyIndex = this.columns.length - 1;
    }
    if (currentIndex > lastRightStickyIndex) {
      return;
    }
    this.columns.splice(currentIndex, 1);
    this.columns.splice(lastRightStickyIndex + 1, 0, column);
  }

  reorderColumnToStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;
    let lastStickyIndex = -1;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].sticky === 'left') {
        lastStickyIndex = i;
      }
    }
    if (currentIndex <= lastStickyIndex) {
      return;
    }
    this.columns.splice(currentIndex, 1);
    this.columns.splice(lastStickyIndex + 1, 0, column);
  }

  reorderColumnToNotStickyGroup(column: ITableColumn): void {
    const currentIndex = this.columns.indexOf(column);
    if (currentIndex === -1) return;
    let firstRightStickyIndex = this.columns.length;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].sticky === 'right') {
        firstRightStickyIndex = i;
        break;
      }
    }
    let lastNotStickyIndex = -1;
    for (let i = 0; i < firstRightStickyIndex; i++) {
      if (this.columns[i].sticky !== 'left') {
        lastNotStickyIndex = i;
      }
    }
    if (currentIndex > lastNotStickyIndex && currentIndex < firstRightStickyIndex) {
      return;
    }
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

  get visibleColumns(): ITableColumn[] {
    return this.visibleColumnsCache;
  }

  trackByColumnField(index: number, column: ITableColumn): string {
    return column.field;
  }

  trackByRow(index: number, item: any): any {
    return item?.id ?? index;
  }

  get hideableColumns(): ITableColumn[] {
    return this.hideableColumnsCache;
  }

  // Toggle visibilidad de columnas
  toggleColumnVisibility(column: ITableColumn, event?: Event): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    if (column.hideable !== true) {
      return;
    }
    const currentVisible = column.visible !== false;
    column.visible = !currentVisible;
    this.columnVisibilityChange.emit({ column, visible: column.visible });
    this.updateColumnCaches();
    this.cdr.markForCheck();
    this.scheduleStickyCalculation();
  }

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
    this.scheduleStickyCalculation();
  }

  areAllColumnsVisible(): boolean {
    const hideableColumns = this.hideableColumns;
    return hideableColumns.length > 0 && hideableColumns.every(col => col.visible !== false);
  }

  areAllColumnsHidden(): boolean {
    const hideableColumns = this.hideableColumns;
    return hideableColumns.length > 0 && hideableColumns.every(col => col.visible === false);
  }

  // M?todos para drag and drop
  isDraggable(column: ITableColumn): boolean {
    return column.visible !== false;
  }

  canReorderColumns(dragged: ITableColumn | null, target: ITableColumn): boolean {
    if (!dragged) return false;
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };
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
    setTimeout(() => {
      document.body.removeChild(clone);
    }, 0);
    th.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
  }

  onDragOver(event: DragEvent, targetColumn: ITableColumn, index: number): void {
    event.preventDefault();
    if (!this.draggedColumn) return;
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };
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
    const isNonSticky = (col: ITableColumn) => {
      return !col.sticky || col.sticky === 'none' || col.sticky === null || col.sticky === undefined;
    };
    const draggedIsNonSticky = isNonSticky(this.draggedColumn);
    const targetIsNonSticky = isNonSticky(targetColumn);
    if (this.draggedColumn.sticky !== targetColumn.sticky && !(draggedIsNonSticky && targetIsNonSticky)) {
      return;
    }
    const draggedIndex = this.columns.indexOf(this.draggedColumn);
    const targetColIndex = this.columns.indexOf(targetColumn);
    if (draggedIndex === -1 || targetColIndex === -1) return;
    this.columns.splice(draggedIndex, 1);
    this.columns.splice(targetColIndex, 0, this.draggedColumn);
    this.columnOrderChange.emit([...this.columns]);
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

  // M?todos para resize
  isResizable(column: ITableColumn): boolean {
    return column.resizable === true && column.visible !== false;
  }

  onResizeStart(column: ITableColumn, event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isResizing = true;
    this.resizingColumn = column;
    this.resizeStartX = event.clientX;
    const th = (event.target as HTMLElement).closest('th') as HTMLElement;
    if (th) {
      this.resizeStartWidth = th.offsetWidth;
    }
    this.resizeMoveListener = (e: MouseEvent) => this.onResizeMove(e);
    this.resizeEndListener = (e: MouseEvent) => this.onResizeEnd(e);
    document.addEventListener('mousemove', this.resizeMoveListener);
    document.addEventListener('mouseup', this.resizeEndListener);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }

  onResizeMove = (event: MouseEvent): void => {
    if (!this.isResizing || !this.resizingColumn) return;
    const deltaX = event.clientX - this.resizeStartX;
    const newWidth = this.resizeStartWidth + deltaX;
    let minWidth = 50;
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
    this.resizingColumn.width = `${finalWidth}px`;
    this.scheduleStickyCalculation();
    this.cdr.markForCheck();
  }

  onResizeEnd = (event: MouseEvent): void => {
    if (!this.isResizing) return;
    this.isResizing = false;
    this.resizingColumn = null;
    if (this.resizeMoveListener) {
      document.removeEventListener('mousemove', this.resizeMoveListener);
      this.resizeMoveListener = undefined;
    }
    if (this.resizeEndListener) {
      document.removeEventListener('mouseup', this.resizeEndListener);
      this.resizeEndListener = undefined;
    }
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    this.scheduleStickyCalculation();
  }

  // M?todos para calcular posiciones sticky
  getColumnWidth(column: ITableColumn, index: number): number {
    if (!this.tableElement) {
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
    if (column.type === 'checkbox') return 50;
    if (column.type === 'acciones') return 100;
    if (column.type === 'date') return 120;
    if (column.type === 'number' || column.type === 'currency') return 100;
    return 150;
  }

  getColumnsControlWidth(): number {
    return 40;
  }

  getStickyLeftPosition(column: ITableColumn, columnIndex: number): number {
    let leftPosition = 0;
    for (let i = 0; i < columnIndex; i++) {
      const prevColumn = this.columns[i];
      if (prevColumn.visible !== false && prevColumn.sticky === 'left') {
        const width = this.getColumnWidth(prevColumn, i);
        leftPosition += width;
      }
    }
    if (column.type === 'checkbox' && column.sticky === 'left' && leftPosition === 0) {
      return -1;
    }
    return leftPosition;
  }

  getStickyRightPosition(column: ITableColumn, columnIndex: number): number {
    let rightPosition = 0;
    rightPosition += this.getColumnsControlWidth();
    for (let i = columnIndex + 1; i < this.columns.length; i++) {
      const nextColumn = this.columns[i];
      if (nextColumn.visible !== false && nextColumn.sticky === 'right') {
        rightPosition += this.getColumnWidth(nextColumn, i);
      }
    }
    return rightPosition;
  }

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
    const visibleColumns = this.visibleColumns;
    const lastHeaderIndex = headerCells.length - 1;
    if (headerCells[lastHeaderIndex]) {
      const controlCell = headerCells[lastHeaderIndex] as HTMLElement;
      controlCell.style.right = '0px';
    }
    headerCells.forEach((cell: Element, cellIndex: number) => {
      if (cellIndex === lastHeaderIndex) return;
      const column = visibleColumns[cellIndex];
      if (!column) return;
      const realIndex = this.columns.indexOf(column);
      if (realIndex === -1) return;
      const htmlCell = cell as HTMLElement;
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
    bodyRows.forEach((row: Element) => {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell: Element, cellIndex: number) => {
        if (cellIndex === cells.length - 1) return;
        const column = visibleColumns[cellIndex];
        if (!column) return;
        const realIndex = this.columns.indexOf(column);
        if (realIndex === -1) return;
        const htmlCell = cell as HTMLElement;
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
  }

  // M?todos para acciones
  onAction(actionType: string, item: any): void {
    this.action.emit({ type: actionType, data: item });
  }

  // Método para verificar si hay acción de suppliers disponible
  hasSuppliersAction(): boolean {
    return this.enableRowClickForSuppliers || this.columns.some(col => col.actions?.includes('suppliers'));
  }

  // Método para manejar click en la fila
  onRowClick(item: any, event: Event): void {
    // Solo procesar si está habilitado el click en fila para suppliers
    if (!this.enableRowClickForSuppliers && !this.columns.some(col => col.actions?.includes('suppliers'))) {
      return;
    }

    // No procesar si se hizo click en elementos interactivos (botones, inputs, enlaces, etc.)
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('input') ||
        target.closest('a') ||
        target.closest('.dropdown') ||
        target.closest('.dropdown-menu') ||
        target.closest('.btn-group') ||
        target.closest('mobentis-list-suppliers-category')) {
      return;
    }

    // No procesar si la fila está en modo edición
    if (this.isEditing(item)) {
      return;
    }

    // Emitir acción de suppliers
    this.onAction('suppliers', item);
  }

  // M?todos para edici?n inline
  isEditing(item: any): boolean {
    return this.editingItemId === this.getIdValue(item);
  }

  onEditFieldChange(item: any, field: string, value: any): void {
    this.editableFieldChange.emit({ item, field, value });
  }

  onSaveEditItem(item: any): void {
    this.saveEdit.emit(item);
  }

  onCancelEditItem(): void {
    this.cancelEdit.emit();
  }

  // Formatos
  formatearMoneda(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return '0,00 ?';
    }
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  }

  formatearNumero(valor: number | null | undefined, decimalPlaces: number = 0): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return decimalPlaces > 0 ? '0' + ',' + '0'.repeat(decimalPlaces) : '0';
    }
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(valor);
  }

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

  onImageError(event: any): void {
    event.target.src = 'assets/images/user.png';
  }
}
