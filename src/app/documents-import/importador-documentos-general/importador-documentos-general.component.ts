import { Component, OnInit } from '@angular/core';
import { ImportadorDocumentosService, DocumentoVenta, EstadoIntegracion } from '../importador-documentos.service';

@Component({
  selector: 'mobentis-importador-documentos-general',
  templateUrl: './importador-documentos-general.component.html',
  styleUrls: ['./importador-documentos-general.component.scss'],
})
export class ImportadorDocumentosGeneralComponent implements OnInit {
  documentos: DocumentoVenta[] = [];
  documentoSeleccionado: DocumentoVenta | null = null;
  documentosSel: Set<number> = new Set();
  documentosInt: Set<number> = new Set();
  loading = false;
  totalItems = 0;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private documentosService: ImportadorDocumentosService) {}

  ngOnInit(): void {
    this.loadDocumentos();
  }

  loadDocumentos(): void {
    this.loading = true;
    this.documentosService
      .getDocumentos([], this.searchTerm, this.currentPage, this.itemsPerPage, '', 'asc')
      .subscribe({
        next: (res) => {
          this.documentos = res.items;
          this.totalItems = res.totalItems;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onSelectDocumento(doc: DocumentoVenta): void {
    this.documentoSeleccionado = doc;
  }

  toggleSel(id: number): void {
    if (this.documentosSel.has(id)) {
      this.documentosSel.delete(id);
    } else {
      this.documentosSel.add(id);
    }
    this.documentosSel = new Set(this.documentosSel);
  }

  toggleInt(id: number): void {
    if (this.documentosInt.has(id)) {
      this.documentosInt.delete(id);
    } else {
      this.documentosInt.add(id);
    }
    this.documentosInt = new Set(this.documentosInt);
  }

  isSel(id: number): boolean {
    return this.documentosSel.has(id);
  }

  isInt(id: number): boolean {
    return this.documentosInt.has(id);
  }

  selTodos(): void {
    this.documentos.forEach((d) => this.documentosSel.add(d.id));
    this.documentosSel = new Set(this.documentosSel);
  }

  deselTodos(): void {
    this.documentosSel.clear();
    this.documentosSel = new Set();
  }

  getEstadoIcon(estado: EstadoIntegracion): string {
    const map: Record<EstadoIntegracion, string> = {
      sin_integrar: 'bi-circle',
      integrandose: 'bi-arrow-repeat',
      integrado: 'bi-check-circle-fill',
      integrado_con_incidencia: 'bi-exclamation-triangle-fill',
      no_integrado_por_incidencia: 'bi-x-circle-fill',
      pendiente_servir: 'bi-clock-fill',
    };
    return map[estado] || 'bi-question-circle';
  }

  getEstadoClass(estado: EstadoIntegracion): string {
    const map: Record<EstadoIntegracion, string> = {
      sin_integrar: 'estado-blanco',
      integrandose: 'estado-azul',
      integrado: 'estado-verde',
      integrado_con_incidencia: 'estado-amarillo',
      no_integrado_por_incidencia: 'estado-rojo',
      pendiente_servir: 'estado-cian',
    };
    return map[estado] || '';
  }

  getEstadoLabel(estado: EstadoIntegracion): string {
    const map: Record<EstadoIntegracion, string> = {
      sin_integrar: 'Sin integrar',
      integrandose: 'Integrándose',
      integrado: 'Integrado',
      integrado_con_incidencia: 'Int. con incidencia',
      no_integrado_por_incidencia: 'No int. por incidencia',
      pendiente_servir: 'Pendiente de servir',
    };
    return map[estado] || estado;
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.currentPage = 1;
    this.loadDocumentos();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadDocumentos();
  }

  onIntegrar(): void {
    // Placeholder: acción Integrar
  }

  onAbrir(): void {
    if (this.documentoSeleccionado) {
      // Placeholder: abrir detalle en modal
    }
  }

  onFiltros(): void {
    // Placeholder: abrir filtros
  }

  tieneAlgunErrorIntegracion(): boolean {
    return this.documentos.some((doc) => !!doc.errorIntegracion);
  }
}
