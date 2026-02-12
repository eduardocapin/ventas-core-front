import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'src/app/core/services/i18n/translation.service';
import { PedidosImportadorService } from '../pedidos-importador.service';
import { IPedido, IPedidoDetalle, PedidosKpisByEstado } from '../pedido.model';
import { ITableColumn } from 'src/app/models/tableColumn.model';
import { ITableSortEvent } from 'src/app/models/tableEvents.model';
import { VisorDocumentoVentaDialogComponent } from '../visor-documento-venta-dialog/visor-documento-venta-dialog.component';
import { Empresa, EmpresaDropdownComponent } from 'src/app/core/components/empresa-dropdown/empresa-dropdown.component';

const ESTADO_LABELS: Record<string, string> = {
  sin_integrar: 'Sin integrar',
  integrandose: 'Integrándose',
  integrado: 'Integrado',
  integrado_con_incidencia: 'Int. con incidencia',
  no_integrado_por_incidencia: 'No int. por incidencia',
  pendiente_servir: 'Pendiente de servir',
  sin_estado: 'Sin estado',
};

const ESTADO_ICONS: Record<string, string> = {
  sin_integrar: 'bi-circle',
  integrandose: 'bi-arrow-repeat',
  integrado: 'bi-check-circle-fill',
  integrado_con_incidencia: 'bi-exclamation-triangle-fill',
  no_integrado_por_incidencia: 'bi-x-circle-fill',
  pendiente_servir: 'bi-clock-fill',
  sin_estado: 'bi-question-circle',
};

const ESTADO_CLASS: Record<string, string> = {
  sin_integrar: 'estado-blanco',
  integrandose: 'estado-azul',
  integrado: 'estado-verde',
  integrado_con_incidencia: 'estado-amarillo',
  no_integrado_por_incidencia: 'estado-rojo',
  pendiente_servir: 'estado-cian',
  sin_estado: '',
};

/** Símbolo tipo icono por estado (para mostrar en tabla sin modificar Core). */
const ESTADO_ICON_CHAR: Record<string, string> = {
  sin_integrar: '○',
  integrandose: '⟳',
  integrado: '✓',
  integrado_con_incidencia: '⚠',
  no_integrado_por_incidencia: '✗',
  pendiente_servir: '◷',
  sin_estado: '?',
};

/**
 * Códigos de la BD (EstadoImportacion) → clave para icono/etiqueta.
 * I1 Sin integrar | I2 Integrándose | I3 Integrado | I4 No int. por incidencia | I6 Int. con incidencia | IN Integrándose
 */
const ESTADO_CODIGO_TO_KEY: Record<string, string> = {
  i1: 'sin_integrar',
  i2: 'integrandose',
  i3: 'integrado',
  i4: 'no_integrado_por_incidencia',
  i6: 'integrado_con_incidencia',
  in: 'integrandose',
  '': 'sin_estado',
};

/**
 * Mapeo inverso: clave normalizada → códigos del backend.
 * Puede haber múltiples códigos para la misma clave (ej: I2 e IN → integrandose)
 */
const ESTADO_KEY_TO_CODIGOS: Record<string, string[]> = {
  sin_integrar: ['I1', 'i1'],
  integrandose: ['I2', 'i2', 'IN', 'in'],
  integrado: ['I3', 'i3'],
  no_integrado_por_incidencia: ['I4', 'i4'],
  integrado_con_incidencia: ['I6', 'i6'],
  sin_estado: [''],
};

@Component({
  selector: 'mobentis-importador-documentos-general',
  templateUrl: './importador-documentos-general.component.html',
  styleUrls: ['./importador-documentos-general.component.scss'],
})
export class ImportadorDocumentosGeneralComponent implements OnInit, AfterViewInit {
  @ViewChild(EmpresaDropdownComponent) empresaDropdown!: EmpresaDropdownComponent;
  
  pedidos: IPedido[] = [];
  pedidoSeleccionado: IPedido | null = null;
  private lastSelectedPedidoId: number | null = null;
  detalleSeleccionado: IPedidoDetalle | null = null;
  pedidosSel: Set<number> = new Set();
  pedidosInt: Set<number> = new Set();
  loading = false;
  loadingDetalle = false;
  totalItems = 0;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  sortColumn = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  kpisByEstado: PedidosKpisByEstado = {};
  loadingKpis = false;
  loadError: string | null = null;
  selectedEmpresasIds: number[] = [];
  empresasInicializadas = false;
  esperandoEmpresas = true; // Flag para esperar a que el dropdown cargue las empresas
  estadoFiltroActivo: string | null = null; // Estado de filtro activo (clave normalizada)
  kpisColapsados = false; // Controla si los KPIs están colapsados

  /** Columnas para mobentis-table (patrón Core). */
  tableColumns: ITableColumn[] = [];
  /** Columnas para la tabla de líneas del detalle (Core: mobentis-table). */
  detalleTableColumns: ITableColumn[] = [];

  constructor(
    private pedidosService: PedidosImportadorService,
    private translation: TranslationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.buildTableColumns();
    this.buildDetalleTableColumns();
    this.loadKpis();
  }

  ngAfterViewInit(): void {
    // El dropdown emitirá el evento empresasChange cuando cargue las empresas
    // Si después de 1 segundo no se ha recibido el evento, cargar sin filtro como fallback
    setTimeout(() => {
      if (this.esperandoEmpresas && !this.empresasInicializadas) {
        this.esperandoEmpresas = false;
        this.loadPedidos();
      }
    }, 1000);
  }

  /**
   * Marca visualmente la fila del pedido seleccionado en la tabla.
   * Usa atributos data-* para identificar las filas sin modificar el componente Core.
   */
  private markSelectedRow(): void {
    const currentSelectedId = this.pedidoSeleccionado?.id ?? null;
    
    // Solo actualizar si cambió la selección
    if (currentSelectedId === this.lastSelectedPedidoId) {
      return;
    }
    
    this.lastSelectedPedidoId = currentSelectedId;
    
    // Usar setTimeout para asegurar que el DOM esté actualizado
    setTimeout(() => {
      const tableContainer = document.querySelector('.documents-grid');
      if (!tableContainer) return;
      
      // Remover la clase de todas las filas
      const allRows = tableContainer.querySelectorAll('tbody tr');
      allRows.forEach(row => {
        row.classList.remove('pedido-seleccionado');
        // Remover atributo data-pedido-id si existe
        row.removeAttribute('data-pedido-id');
      });
      
      // Si hay un pedido seleccionado, encontrar y marcar su fila
      if (currentSelectedId !== null && this.pedidos.length > 0) {
        // Buscar el pedido en el array
        const pedidoIndex = this.pedidos.findIndex(p => p.id === currentSelectedId);
        if (pedidoIndex >= 0) {
          // Encontrar la fila correspondiente (índice en tbody)
          const rows = Array.from(tableContainer.querySelectorAll('tbody tr'));
          // Filtrar filas que no sean de "no hay datos"
          const dataRows = rows.filter(row => {
            const colspan = row.querySelector('td[colspan]');
            return !colspan; // Las filas con colspan son mensajes de "no hay datos"
          });
          
          if (pedidoIndex < dataRows.length) {
            const selectedRow = dataRows[pedidoIndex];
            selectedRow.classList.add('pedido-seleccionado');
            selectedRow.setAttribute('data-pedido-id', String(currentSelectedId));
          }
        }
      }
    }, 0);
  }

  private buildDetalleTableColumns(): void {
    this.detalleTableColumns = [
      { field: 'estadoIconChar', header: this.translation.t('importadorDocumentos.detail.comboIntegracion'), type: 'text', sortable: false, align: 'center' },
      { field: 'codigoArticulo', header: this.translation.t('importadorDocumentos.detail.codigoArticulo'), type: 'text', sortable: false },
      { field: 'descripcionArticulo', header: this.translation.t('importadorDocumentos.detail.descripcionArticulo'), type: 'text', sortable: false },
      { field: 'codigoPromocion', header: this.translation.t('importadorDocumentos.detail.codigoPromocion'), type: 'text', sortable: false },
      { field: 'unidadesVendidas', header: this.translation.t('importadorDocumentos.detail.unidadesVendidas'), type: 'number', sortable: false, align: 'right' },
      { field: 'descripcionUnidadVendida', header: this.translation.t('importadorDocumentos.detail.descripcionUnidadVendida'), type: 'text', sortable: false },
      { field: 'importe', header: this.translation.t('importadorDocumentos.detail.importe'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento1', header: this.translation.t('importadorDocumentos.detail.descuento1'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento2', header: this.translation.t('importadorDocumentos.detail.descuento2'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento3', header: this.translation.t('importadorDocumentos.detail.descuento3'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento4', header: this.translation.t('importadorDocumentos.detail.descuento4'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento5', header: this.translation.t('importadorDocumentos.detail.descuento5'), type: 'currency', sortable: false, align: 'right' },
      { field: 'total', header: this.translation.t('importadorDocumentos.detail.total'), type: 'currency', sortable: false, align: 'right' },
      { field: 'motivoDevolucion', header: this.translation.t('importadorDocumentos.detail.motivoDevolucion'), type: 'text', sortable: false },
      { field: 'comboAdjunto', header: this.translation.t('importadorDocumentos.detail.comboAdjunto'), type: 'text', sortable: false },
      { field: 'notaLinea', header: this.translation.t('importadorDocumentos.detail.notaLinea'), type: 'text', sortable: false },
      { field: 'observacion', header: this.translation.t('importadorDocumentos.detail.observacion'), type: 'text', sortable: false },
      { field: 'errorIntegracion', header: this.translation.t('importadorDocumentos.detail.errorIntegracion'), type: 'text', sortable: false },
    ];
  }

  /** Título del header del panel de detalle (Core: mobentis-popup-header). */
  getDetalleHeaderTitle(): string {
    if (!this.pedidoSeleccionado) return '';
    const p = this.pedidoSeleccionado;
    const tipo = p.tipoPedido ?? p.tipoDocumento ?? '';
    const cod = p.idDocumentoPDA ?? p.numero ?? '';
    const nombre = p.nombreCliente  ??  p.codigoCliente ?? '';
    return `${tipo} — ${cod} — ${nombre}`.trim();
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
    this.detalleSeleccionado = null;
    this.lastSelectedPedidoId = null;
    // Remover la marca de la fila seleccionada
    setTimeout(() => this.markSelectedRow(), 0);
  }

  private buildTableColumns(): void {
    this.tableColumns = [
      {
        field: 'estadoIconChar',
        header: this.translation.t('importadorDocumentos.col.estadoImportacion'),
        type: 'text',
        sortable: false,
        align: 'center',
      },
      {
        field: 'integrar',
        header: this.translation.t('importadorDocumentos.col.comboIntegracion'),
        type: 'checkbox',
        sortable: false,
        sticky: 'left',
        hideable: false,
      },
      {
        field: 'idDocumentoPDA',
        header: this.translation.t('importadorDocumentos.col.codigoPda'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'tipoDocumento',
        header: this.translation.t('importadorDocumentos.col.tipoPedido'),
        type: 'text',
        sortable: true,
      },
      {
        field: 'nombreEmpresa',
        header: this.translation.t('importadorDocumentos.col.empresa'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'fechaDocumento',
        header: this.translation.t('importadorDocumentos.col.fechaDocumento'),
        type: 'date',
        sortable: true,
      },
      {
        field: 'horaConsolidacion',
        header: this.translation.t('importadorDocumentos.col.horaConsolidacion'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'fechaEntrega',
        header: this.translation.t('importadorDocumentos.col.fechaEntrega'),
        type: 'date',
        sortable: false,
      },
      {
        field: 'codigoCliente',
        header: this.translation.t('importadorDocumentos.col.codigoCliente'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'clienteNFiscal',
        header: this.translation.t('importadorDocumentos.col.nombreCliente'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'nombreAgente',
        header: this.translation.t('importadorDocumentos.col.nombreAgente'),
        type: 'text',
        sortable: true,
      },
      {
        field: 'codigoAgente',
        header: this.translation.t('importadorDocumentos.col.codigoAgente'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'dto1',
        header: this.translation.t('importadorDocumentos.col.importeDescuento1'),
        type: 'currency',
        sortable: false,
        align: 'right',
      },
      {
        field: 'dto2',
        header: this.translation.t('importadorDocumentos.col.importeDescuento2'),
        type: 'currency',
        sortable: false,
        align: 'right',
      },
      {
        field: 'dtoPP',
        header: this.translation.t('importadorDocumentos.col.importeDescuentoDToPP'),
        type: 'currency',
        sortable: false,
        align: 'right',
      },
      {
        field: 'importe',
        header: this.translation.t('importadorDocumentos.col.importe'),
        type: 'currency',
        sortable: false,
        align: 'right',
      },
      {
        field: 'total',
        header: this.translation.t('importadorDocumentos.col.total'),
        type: 'currency',
        sortable: false,
        align: 'right',
      },
      {
        field: 'nota',
        header: this.translation.t('importadorDocumentos.col.nota'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'tieneFirma',
        header: this.translation.t('importadorDocumentos.col.tieneFirma'),
        type: 'text',
        sortable: false,
        align: 'center',
      },
      {
        field: 'errorIntegracion',
        header: this.translation.t('importadorDocumentos.col.errorIntegracion'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'idPedidoTipoERP',
        header: this.translation.t('importadorDocumentos.col.idPedidoTipoERP'),
        type: 'text',
        sortable: false,
      },
      {
        field: 'acciones',
        header: '',
        type: 'acciones',
        sortable: false,
        sticky: 'right',
        actions: ['view'],
      },
    ];
  }

  /** Datos para la tabla con estado como icono y combo tieneFirma. */
  get pedidosParaTabla(): any[] {
    return this.pedidos.map((p) => ({
      ...p,
      idDocumentoPDA: p.idDocumentoPDA ?? p.codigoPda,
      tipoDocumento: p.tipoDocumento ?? p.tipoPedido,
      fechaDocumento: p.fechaDocumento ?? p.fecha,
      codigoAgente: p.codigoAgente ?? this.getAgenteCodigo(p),
      clienteNFiscal: p.nombreCliente ?? p.clienteNFiscal ?? p.cliente,
      estadoIconChar: this.getEstadoIconChar(p.estadoImportacion ?? p.estadoIntegracion),
      nota: p.observaciones ?? p.nota ?? '',
      tieneFirma: p.tieneFirma == null ? '' : (p.tieneFirma ? 'Sí' : 'No'),
    }));
  }

  /** Código del agente que realizó la venta (fabricante o ERP). */
  private getAgenteCodigo(p: IPedido): string {
    const d = p.agenteDatos;
    if (!d) return '';
    return (d.codigoAgenteFabricante ?? d.codigoAgenteERP ?? '').trim();
  }

  /** Líneas del detalle con estado como icono (símbolo) para la tabla. */
  get lineasParaTabla(): any[] {
    if (!this.detalleSeleccionado?.lineas?.length) return [];
    return this.detalleSeleccionado.lineas.map((l) => ({
      ...l,
      codigoArticulo: l.codigoArticulo ?? l.referencia,
      descripcionArticulo: l.descripcionArticulo ?? l.descripcion,
      unidadesVendidas: l.unidadesVendidas ?? l.unidades,
      importe: l.importe ?? l.precio,
      estadoIconChar: this.getEstadoIconChar(l.comboIntegracion ?? l.estadoIntegracion),
      observacion: l.notaLinea ?? '',
      errorIntegracion: l.errorIntegracion ?? l.mensajeErrorIntegracion ?? '',
    }));
  }

  get selectedIds(): number[] {
    return Array.from(this.pedidosInt);
  }

  getId(item: any): number {
    return item?.id ?? 0;
  }

  onSelectionChange(ids: number[]): void {
    this.pedidosInt = new Set(ids);
  }

  onSortChange(event: ITableSortEvent): void {
    this.sortColumn = event.sortColumn;
    this.sortDirection = event.sortDirection;
    this.currentPage = 1;
    this.loadPedidos();
  }

  onTableAction(event: { type: string; data: any }): void {
    if (event.type === 'view' && event.data) {
      this.onSelectPedido(event.data as IPedido);
    }
  }

  /**
   * Doble clic en una fila de la tabla: selecciona ese pedido y carga el detalle en el panel inferior
   * (mismo efecto que pulsar el botón "Ampliar" / view en la fila).
   */
  onTableRowDblClick(event: MouseEvent): void {
    const tr = (event.target as HTMLElement).closest('tbody tr');
    if (!tr || !this.pedidos.length) return;
    const tbody = tr.closest('tbody');
    if (!tbody) return;
    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
    const rowIndex = rows.indexOf(tr as HTMLTableRowElement);
    if (rowIndex < 0 || rowIndex >= this.pedidos.length) return;
    const pedido = this.pedidos[rowIndex];
    if (pedido?.id != null) {
      this.onSelectPedido(pedido);
      // Marcar la fila seleccionada después de seleccionar
      setTimeout(() => this.markSelectedRow(), 0);
    }
  }

  onEmpresasChange(empresas: Empresa[]): void {
    if (!empresas || empresas.length === 0) {
      this.esperandoEmpresas = false;
      return;
    }
    
    // Extraer solo los IDs de las empresas seleccionadas
    const newSelectedIds = empresas
      .filter(e => e.selected)
      .map(e => e.id);
    
    // Solo recargar si cambió la selección o es la primera vez
    const hasChanged = !this.empresasInicializadas || 
      JSON.stringify(this.selectedEmpresasIds.sort()) !== JSON.stringify(newSelectedIds.sort());
    
    this.selectedEmpresasIds = newSelectedIds;
    this.empresasInicializadas = true;
    this.esperandoEmpresas = false;
    
    // Recargar datos con el nuevo filtro
    if (hasChanged) {
      this.currentPage = 1;
      this.loadPedidos();
      this.loadKpis();
    }
  }

  loadPedidos(): void {
    // No cargar si aún estamos esperando a que el dropdown cargue las empresas
    if (this.esperandoEmpresas && !this.empresasInicializadas) {
      return;
    }
    
    this.loading = true;
    this.loadError = null;
    
    // Preparar filtros incluyendo empresas seleccionadas y estado
    const filters: { [key: string]: any } = {};
    if (this.selectedEmpresasIds.length > 0) {
      filters['empresasIds'] = this.selectedEmpresasIds;
    }
    
    // Agregar filtro de estado si hay uno activo
    if (this.estadoFiltroActivo) {
      filters['estadoImportacion'] = this.getCodigosEstadoParaFiltro(this.estadoFiltroActivo);
    }
    
    this.pedidosService
      .getData(
        filters,
        this.searchTerm,
        this.currentPage,
        this.itemsPerPage,
        this.sortColumn,
        this.sortDirection
      )
      .subscribe({
        next: (res) => {
          this.pedidos = res?.items ?? [];
          this.totalItems = res?.totalItems ?? 0;
          this.loading = false;
          // Marcar la fila seleccionada después de cargar los pedidos
          setTimeout(() => this.markSelectedRow(), 100);
        },
        error: (err) => {
          this.pedidos = [];
          this.totalItems = 0;
          this.loading = false;
          this.loadError = err?.error?.message ?? err?.message ?? 'Error al cargar los pedidos. Comprueba que el backend esté en marcha y la URL (apiUrl) sea correcta.';
        },
      });
  }

  /**
   * Obtiene los códigos del backend para un estado normalizado.
   * Retorna un array con los códigos posibles (ej: ['I2', 'IN'] para 'integrandose').
   */
  private getCodigosEstadoParaFiltro(claveNormalizada: string): string[] {
    return ESTADO_KEY_TO_CODIGOS[claveNormalizada] ?? [];
  }

  loadKpis(): void {
    this.loadingKpis = true;
    // Pasar los IDs de empresas seleccionadas como filtro
    const empresasIds = this.selectedEmpresasIds && this.selectedEmpresasIds.length > 0 
      ? this.selectedEmpresasIds 
      : undefined;
    
    this.pedidosService.getKpisByEstado(empresasIds).subscribe({
      next: (kpis) => {
        // Normalizar las claves de los KPIs del backend (I1, I2, etc.) a claves normalizadas
        this.kpisByEstado = this.normalizarKpisByEstado(kpis);
        this.loadingKpis = false;
      },
      error: () => {
        this.loadingKpis = false;
      },
    });
  }

  /**
   * Normaliza las claves de los KPIs del backend (códigos como I1, I2, I3, etc.)
   * a las claves normalizadas usadas en el frontend (sin_integrar, integrado, etc.)
   */
  private normalizarKpisByEstado(kpis: PedidosKpisByEstado): PedidosKpisByEstado {
    const kpisNormalizados: PedidosKpisByEstado = {};
    
    for (const [key, value] of Object.entries(kpis)) {
      if (value === null || value === undefined || isNaN(Number(value))) {
        continue; // Saltar valores inválidos
      }
      
      // Normalizar la clave usando el mismo mapeo que para los estados individuales
      const claveNormalizada = this.normalizarEstadoClave(key);
      
      // Si ya existe esa clave normalizada, sumar los valores
      if (kpisNormalizados[claveNormalizada] !== undefined) {
        kpisNormalizados[claveNormalizada] += Number(value);
      } else {
        kpisNormalizados[claveNormalizada] = Number(value);
      }
    }
    
    return kpisNormalizados;
  }

  onSelectPedido(p: IPedido): void {
    this.pedidoSeleccionado = p;
    this.detalleSeleccionado = null;
    this.loadingDetalle = true;
    // Marcar la fila seleccionada inmediatamente
    this.markSelectedRow();
    this.pedidosService.getDetalle(p.id).subscribe({
      next: (detalle) => {
        this.detalleSeleccionado = detalle;
        this.loadingDetalle = false;
        // Volver a marcar después de cargar el detalle
        this.markSelectedRow();
      },
      error: () => {
        this.loadingDetalle = false;
      },
    });
  }

  toggleSel(id: number): void {
    if (this.pedidosSel.has(id)) {
      this.pedidosSel.delete(id);
    } else {
      this.pedidosSel.add(id);
    }
    this.pedidosSel = new Set(this.pedidosSel);
  }

  toggleInt(id: number): void {
    if (this.pedidosInt.has(id)) {
      this.pedidosInt.delete(id);
    } else {
      this.pedidosInt.add(id);
    }
    this.pedidosInt = new Set(this.pedidosInt);
  }

  isSel(id: number): boolean {
    return this.pedidosSel.has(id);
  }

  isInt(id: number): boolean {
    return this.pedidosInt.has(id);
  }

  selTodos(): void {
    this.pedidos.forEach((p) => this.pedidosSel.add(p.id));
    this.pedidosSel = new Set(this.pedidosSel);
  }

  deselTodos(): void {
    this.pedidosSel.clear();
    this.pedidosSel = new Set();
  }

  /** Normaliza el valor de estado (API/BD) a la clave usada por iconos y etiquetas. */
  private normalizarEstadoClave(estado: string | undefined | null): string {
    if (!estado) return 'sin_estado';
    
    const raw = estado.toString().trim();
    if (!raw) return 'sin_estado';
    
    // Si ya es una clave normalizada (existe en ESTADO_ICONS), devolverla directamente
    if (ESTADO_ICONS[raw]) return raw;
    
    // Intentar con minúsculas
    const v = raw.toLowerCase();
    if (ESTADO_ICONS[v]) return v;
    
    // Buscar en el mapeo de códigos (intentar minúsculas, original, y mayúsculas)
    const mapeoMinusculas = ESTADO_CODIGO_TO_KEY[v];
    if (mapeoMinusculas) return mapeoMinusculas;
    
    const mapeoOriginal = ESTADO_CODIGO_TO_KEY[raw];
    if (mapeoOriginal) return mapeoOriginal;
    
    const mapeoMayusculas = ESTADO_CODIGO_TO_KEY[raw.toUpperCase()];
    if (mapeoMayusculas) return mapeoMayusculas;
    
    // Si no se encuentra en el mapeo, devolver como sin_estado
    return 'sin_estado';
  }

  getEstadoIcon(estado: string | undefined): string {
    const key = this.normalizarEstadoClave(estado);
    return ESTADO_ICONS[key] ?? 'bi-question-circle';
  }

  getEstadoClass(estado: string | undefined): string {
    const key = this.normalizarEstadoClave(estado);
    return ESTADO_CLASS[key] ?? '';
  }

  getEstadoLabel(estado: string | undefined): string {
    const key = this.normalizarEstadoClave(estado);
    return ESTADO_LABELS[key] ?? (estado ?? '');
  }

  /** Símbolo tipo icono para mostrar en la columna de estado (sin usar HTML/Core). */
  getEstadoIconChar(estado: string | undefined): string {
    const key = this.normalizarEstadoClave(estado);
    return ESTADO_ICON_CHAR[key] ?? '?';
  }

  /** Indica si el estado es integrado o integrando (para deshabilitar checkbox Integrar). */
  isIntegradoOrIntegrandose(estado: string | undefined): boolean {
    const key = this.normalizarEstadoClave(estado);
    return key === 'integrado' || key === 'integrandose';
  }

  get kpisEstadosOrdenados(): { key: string; label: string; value: number }[] {
    const order = [
      'sin_integrar',
      'integrandose',
      'integrado',
      'integrado_con_incidencia',
      'no_integrado_por_incidencia',
      'pendiente_servir',
      'sin_estado',
    ];
    return order
      .filter((key) => this.kpisByEstado[key] !== undefined)
      .map((key) => ({
        key,
        label: this.getEstadoLabel(key),
        value: this.kpisByEstado[key] ?? 0,
      }))
      .concat(
        Object.keys(this.kpisByEstado)
          .filter((k) => !order.includes(k))
          .map((key) => ({
            key,
            label: this.getEstadoLabel(key),
            value: this.kpisByEstado[key] ?? 0,
          }))
      );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadPedidos();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadPedidos();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPedidos();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadPedidos();
  }

  onIntegrar(): void {
    // Placeholder: acción Integrar
  }

  onAbrir(): void {
    if (this.pedidoSeleccionado) {
      this.dialog.open(VisorDocumentoVentaDialogComponent, {
        data: { pedido: this.pedidoSeleccionado },
        width: '95vw',
        maxWidth: '1200px',
      });
    }
  }

  onFiltros(): void {
    // Placeholder: abrir filtros
  }

  tieneAlgunErrorIntegracion(): boolean {
    return this.pedidos.some((p) => !!p.mensajeErrorIntegracion);
  }

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '−';
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return isNaN(d.getTime()) ? String(fecha) : d.toISOString().split('T')[0];
  }

  /** KPI: Total de documentos (suma de todos los estados) */
  getKpiTotalDocumentos(): number {
    if (!this.kpisByEstado || Object.keys(this.kpisByEstado).length === 0) {
      return 0;
    }
    return Object.values(this.kpisByEstado).reduce((sum, count) => sum + (Number(count) || 0), 0);
  }

  /** KPI: Documentos pendientes de integrar */
  getKpiPendientes(): number {
    if (!this.kpisByEstado) return 0;
    return Number(this.kpisByEstado['sin_integrar'] ?? 0);
  }

  /** KPI: Documentos integrados correctamente */
  getKpiIntegrados(): number {
    if (!this.kpisByEstado) return 0;
    return Number(this.kpisByEstado['integrado'] ?? 0);
  }

  /** KPI: Documentos integrados con incidencia */
  getKpiIntegradosConIncidencia(): number {
    if (!this.kpisByEstado) return 0;
    return Number(this.kpisByEstado['integrado_con_incidencia'] ?? 0);
  }

  /** KPI: Documentos no integrados por incidencia */
  getKpiNoIntegradosPorIncidencia(): number {
    if (!this.kpisByEstado) return 0;
    return Number(this.kpisByEstado['no_integrado_por_incidencia'] ?? 0);
  }

  /** KPI: Documentos en proceso de integración */
  getKpiEnProceso(): number {
    if (!this.kpisByEstado) return 0;
    return Number(this.kpisByEstado['integrandose'] ?? 0);
  }

  /**
   * Maneja el click en un KPI para filtrar por estado.
   * Si se hace click en el mismo KPI, se quita el filtro.
   */
  onKpiClick(estadoClave: string | null): void {
    if (this.estadoFiltroActivo === estadoClave) {
      // Si se hace click en el mismo KPI, quitar el filtro
      this.estadoFiltroActivo = null;
    } else {
      // Aplicar nuevo filtro
      this.estadoFiltroActivo = estadoClave;
    }
    
    // Resetear a la primera página y recargar
    this.currentPage = 1;
    this.loadPedidos();
  }

  /**
   * Verifica si un estado está actualmente filtrado.
   */
  isEstadoFiltrado(estadoClave: string | null): boolean {
    return this.estadoFiltroActivo === estadoClave;
  }

  /**
   * Limpia el filtro de estado activo.
   */
  limpiarFiltroEstado(): void {
    this.estadoFiltroActivo = null;
    this.currentPage = 1;
    this.loadPedidos();
  }

  /**
   * Alterna el estado de colapso de los KPIs.
   */
  toggleKpisColapsados(): void {
    this.kpisColapsados = !this.kpisColapsados;
  }
}
