import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PedidosImportadorService } from '../pedidos-importador.service';
import { IPedido, IPedidoDetalle, IPedidoLinea } from '../pedido.model';
import { ITableColumn } from 'src/app/models/tableColumn.model';
import { TranslationService } from 'src/app/core/services/i18n/translation.service';

const ESTADO_LABELS: Record<string, string> = {
  sin_integrar: 'Sin integrar',
  integrandose: 'Integrándose',
  integrado: 'Integrado',
  integrado_con_incidencia: 'Int. con incidencia',
  no_integrado_por_incidencia: 'No int. por incidencia',
  pendiente_servir: 'Pendiente de servir',
  sin_estado: 'Sin estado',
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

export interface VisorDocumentoVentaData {
  pedido: IPedido;
}

@Component({
  selector: 'mobentis-visor-documento-venta-dialog',
  templateUrl: './visor-documento-venta-dialog.component.html',
  styleUrls: ['./visor-documento-venta-dialog.component.scss'],
})
export class VisorDocumentoVentaDialogComponent implements OnInit {
  pedido: IPedido;
  detalle: IPedidoDetalle | null = null;
  loading = true;
  loadError: string | null = null;
  lineasTableColumns: ITableColumn[] = [];

  constructor(
    public dialogRef: MatDialogRef<VisorDocumentoVentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VisorDocumentoVentaData,
    private pedidosService: PedidosImportadorService,
    private translation: TranslationService,
  ) {
    this.pedido = data?.pedido ?? ({} as IPedido);
  }

  ngOnInit(): void {
    this.buildLineasTableColumns();
    const id = this.pedido?.id;
    if (id == null || typeof id !== 'number') {
      this.loadError = 'Documento no válido.';
      this.loading = false;
      return;
    }
    this.pedidosService.getDetalle(id).subscribe({
      next: (d) => {
        this.detalle = d;
        this.loading = false;
      },
      error: (err) => {
        this.loadError = err?.error?.message ?? err?.message ?? 'Error al cargar el detalle.';
        this.loading = false;
      },
    });
  }

  private buildLineasTableColumns(): void {
    this.lineasTableColumns = [
      { field: 'referencia', header: this.translation.t('importadorDocumentos.visor.referencia'), type: 'text', sortable: false },
      { field: 'descripcion', header: this.translation.t('importadorDocumentos.visor.descripcion'), type: 'text', sortable: false },
      { field: 'promocion', header: this.translation.t('importadorDocumentos.visor.promocion'), type: 'text', sortable: false },
      { field: 'importe', header: this.translation.t('importadorDocumentos.visor.importe'), type: 'currency', sortable: false, align: 'right' },
      { field: 'unidades', header: this.translation.t('importadorDocumentos.visor.uds'), type: 'number', sortable: false, align: 'right' },
      { field: 'precio', header: this.translation.t('importadorDocumentos.visor.ud'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento1', header: this.translation.t('importadorDocumentos.visor.dto1'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento2', header: this.translation.t('importadorDocumentos.visor.dto2'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento3', header: this.translation.t('importadorDocumentos.visor.dto3'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento4', header: this.translation.t('importadorDocumentos.visor.dto4'), type: 'currency', sortable: false, align: 'right' },
      { field: 'descuento', header: this.translation.t('importadorDocumentos.visor.dto'), type: 'currency', sortable: false, align: 'right' },
    ];
  }

  getDialogTitle(): string {
    const p = this.pedido;
    const tipo = p.tipoPedido ?? p.tipoDocumento ?? '';
    const cod = p.codigoDocumento ?? p.numero ?? '';
    const nombre = p.nombreCliente ?? p.cliente ?? '';
    return `${tipo} ${cod} — ${nombre}`.trim() || this.translation.t('importadorDocumentos.visor.title');
  }

  /** Valor para mostrar en solo lectura; vacío/undefined → "−". */
  v(val?: string | number | undefined | null): string {
    if (val === undefined || val === null || val === '') return '−';
    return String(val);
  }

  formatFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '−';
    const d = typeof fecha === 'string' ? new Date(fecha) : fecha;
    if (isNaN(d.getTime())) return '−';
    // Formato dd/mm/yyyy
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatPorcentaje(porcentaje: number | undefined | null): string {
    if (porcentaje === undefined || porcentaje === null) return '';
    return `${Number(porcentaje).toFixed(2)}%`;
  }

  getEstadoClass(estado: string | undefined | null): string {
    if (!estado) return '';
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('integrado') && !estadoLower.includes('incidencia')) {
      return 'estado-verde';
    }
    if (estadoLower.includes('incidencia') || estadoLower.includes('error')) {
      return 'estado-rojo';
    }
    if (estadoLower.includes('integrando')) {
      return 'estado-azul';
    }
    if (estadoLower.includes('pendiente')) {
      return 'estado-amarillo';
    }
    return '';
  }

  /**
   * Convierte el código de estado (ej: "I3") a su descripción legible (ej: "Integrado").
   */
  getEstadoDescripcion(estado: string | undefined | null): string {
    if (!estado) return 'Sin estado';
    const estadoLower = estado.toLowerCase().trim();
    const key = ESTADO_CODIGO_TO_KEY[estadoLower] || 'sin_estado';
    return ESTADO_LABELS[key] || estado;
  }

  formatNum(n: number | undefined | null): string {
    if (n === undefined || n === null) return '−';
    return Number(n).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  /** Líneas mapeadas para la tabla del visor (referencia, descripción, promoción, importe, uds, ud, dto1-4, dto). */
  get lineasParaTabla(): any[] {
    if (!this.detalle?.lineas?.length) return [];
    return this.detalle.lineas.map((l: IPedidoLinea) => ({
      referencia: l.referencia ?? l.codigoArticulo ?? '−',
      descripcion: l.descripcion ?? l.descripcionArticulo ?? '−',
      promocion: l.codigoPromocion ?? '−',
      importe: l.importe ?? l.precio,
      unidades: l.unidades ?? l.unidadesVendidas,
      precio: l.precio,
      descuento1: l.descuento1,
      descuento2: l.descuento2,
      descuento3: l.descuento3,
      descuento4: l.descuento4,
      descuento: l.descuento,
    }));
  }

  get totales(): IPedidoDetalle['totales'] {
    return this.detalle?.totales ?? this.pedido.totales;
  }
}
