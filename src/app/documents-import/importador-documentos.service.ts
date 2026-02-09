import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type EstadoIntegracion =
  | 'sin_integrar'
  | 'integrandose'
  | 'integrado'
  | 'integrado_con_incidencia'
  | 'no_integrado_por_incidencia'
  | 'pendiente_servir';

export interface LineaDocumento {
  id: number;
  referencia: string;
  descripcion: string;
  unidades: number;
  precioUnitario: number;
  descuento: number;
  total: number;
}

export interface DocumentoVenta {
  id: number;
  tipo: string;
  numero: string;
  cliente: string;
  agente: string;
  fecha: string;
  delegacion?: string;
  zonaGeografica?: string;
  estado: EstadoIntegracion;
  errorIntegracion?: string;
  lineas: LineaDocumento[];
  notas?: string;
  notasLogisticas?: string;
}

export interface PaginatedDocumentsResponse {
  items: DocumentoVenta[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImportadorDocumentosService {
  private documentosMock: DocumentoVenta[] = this.generarDocumentosMock();

  private generarDocumentosMock(): DocumentoVenta[] {
    const tipos = ['Pedido', 'Albarán', 'Factura', 'Presupuesto'];
    const clientes = ['Cliente A S.L.', 'Distribuidora Norte', 'Comercial Sur', 'Almacenes Central'];
    const agentes = ['Juan Pérez', 'María García', 'Carlos López'];
    const estados: EstadoIntegracion[] = [
      'sin_integrar',
      'integrado',
      'no_integrado_por_incidencia',
      'integrandose',
      'pendiente_servir',
      'integrado_con_incidencia',
    ];
    const lineasBase: LineaDocumento[] = [
      { id: 1, referencia: 'ART-001', descripcion: 'Producto Alpha', unidades: 10, precioUnitario: 25.5, descuento: 5, total: 242.25 },
      { id: 2, referencia: 'ART-002', descripcion: 'Producto Beta', unidades: 5, precioUnitario: 120, descuento: 0, total: 600 },
      { id: 3, referencia: 'ART-003', descripcion: 'Producto Gamma', unidades: 2, precioUnitario: 89.9, descuento: 10, total: 161.82 },
    ];
    const docs: DocumentoVenta[] = [];
    for (let i = 1; i <= 12; i++) {
      const estado = estados[(i - 1) % estados.length];
      docs.push({
        id: i,
        tipo: tipos[(i - 1) % tipos.length],
        numero: `${1000 + i}`,
        cliente: clientes[(i - 1) % clientes.length],
        agente: agentes[(i - 1) % agentes.length],
        fecha: new Date(2026, 1, 5 + (i % 3)).toISOString().split('T')[0],
        delegacion: `Delegación ${((i - 1) % 3) + 1}`,
        zonaGeografica: ['Norte', 'Sur', 'Centro'][(i - 1) % 3],
        estado,
        errorIntegracion: estado === 'no_integrado_por_incidencia' || estado === 'integrado_con_incidencia'
          ? 'Producto no existe en ERP'
          : undefined,
        lineas: lineasBase.map((l, idx) => ({ ...l, id: i * 10 + idx })),
        notas: i % 2 === 0 ? `Notas documento ${i}` : undefined,
        notasLogisticas: i % 3 === 0 ? `Entrega preferente` : undefined,
      });
    }
    return docs;
  }

  getDocumentos(
    _filtros: unknown,
    _searchTerm: string,
    _currentPage: number,
    _itemsPerPage: number,
    _sortColumn: string,
    _sortDirection: string
  ): Observable<PaginatedDocumentsResponse> {
    return of({
      items: [...this.documentosMock],
      totalItems: this.documentosMock.length,
    }).pipe(delay(300));
  }
}
