import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/core/services/auth/login.service';
import { IPedido, IPedidoDetalle, PedidosKpisByEstado } from './pedido.model';

export interface PedidosListResponse {
  items: IPedido[];
  totalItems: number;
}

/**
 * Servicio de datos de pedidos para el Importador de Documentos.
 * Implementa la firma getData(...) compatible con componentes Core de tabla (IEntityDataService).
 */
@Injectable({
  providedIn: 'root',
})
export class PedidosImportadorService {
  private readonly apiUrl = `${environment.apiUrl}/api/pedidos`;

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  /**
   * Listado paginado (POST pedidos/list). Compatible con mobentis-entity-table-manager / IEntityDataService.
   */
  getData(
    selectedFilters: { [key: string]: any },
    searchTerm: string,
    currentPage: number,
    itemsPerPage: number,
    sortColumn: string,
    sortDirection: string
  ): Observable<PedidosListResponse> {
    const body: any = {
      selectedFilters: selectedFilters ? Object.keys(selectedFilters).map((k) => ({ id: k, valor: selectedFilters[k] })) : [],
      searchTerm: searchTerm ?? '',
      currentPage,
      itemsPerPage,
      sortColumn: sortColumn ?? 'id',
      sortDirection: sortDirection ?? 'asc',
    };
    
    // Añadir filtro de empresas si está presente
    if (selectedFilters?.['empresasIds'] && Array.isArray(selectedFilters['empresasIds']) && selectedFilters['empresasIds'].length > 0) {
      body.empresasIds = selectedFilters['empresasIds'];
    }
    
    return this.http.post<PedidosListResponse>(
      `${this.apiUrl}/list`,
      body,
      { headers: this.getHeaders() }
    );
  }

  /**
   * Detalle de un pedido con líneas (GET pedidos/:id).
   */
  getDetalle(id: number): Observable<IPedidoDetalle> {
    return this.http.get<IPedidoDetalle>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  /**
   * KPIs por estado de integración (GET pedidos/kpis).
   */
  getKpisByEstado(): Observable<PedidosKpisByEstado> {
    return this.http.get<PedidosKpisByEstado>(`${this.apiUrl}/kpis`, {
      headers: this.getHeaders(),
    });
  }
}
