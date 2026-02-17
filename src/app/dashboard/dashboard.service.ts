import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { LoginService } from "src/app/core/services/auth/login.service";

export interface TopCliente {
  clienteId: number;
  nombreCliente: string;
  totalPedidos: number;
  valorTotal: number;
}

export interface TopProducto {
  referencia: string;
  descripcion: string;
  cantidadTotal: number;
  valorTotal: number;
}

export interface TopPedido {
  pedidoId: number;
  numero: string;
  nombreCliente: string;
  fecha: Date;
  valorTotal: number;
}

export interface DashboardTopClientesResponse {
  items: TopCliente[];
}

export interface DashboardTopProductosResponse {
  items: TopProducto[];
}

export interface DashboardTopPedidosResponse {
  items: TopPedido[];
}

export interface DashboardFilter {
  empresasIds?: number[];
  /** Filtro por fecha del pedido (ISO). Por defecto último año. */
  fechaDesde?: string;
  fechaHasta?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  getTop10Clientes(filter?: DashboardFilter): Observable<DashboardTopClientesResponse> {
    const body = this.buildFilterBody(filter);
    return this.http.post<DashboardTopClientesResponse>(
      `${this.apiUrl}/api/pedidos/dashboard/top-clientes`,
      body,
      { headers: this.getHeaders() }
    );
  }

  getTop10Productos(filter?: DashboardFilter): Observable<DashboardTopProductosResponse> {
    const body = this.buildFilterBody(filter);
    return this.http.post<DashboardTopProductosResponse>(
      `${this.apiUrl}/api/pedidos/dashboard/top-productos`,
      body,
      { headers: this.getHeaders() }
    );
  }

  getTop10Pedidos(filter?: DashboardFilter): Observable<DashboardTopPedidosResponse> {
    const body = this.buildFilterBody(filter);
    return this.http.post<DashboardTopPedidosResponse>(
      `${this.apiUrl}/api/pedidos/dashboard/top-pedidos`,
      body,
      { headers: this.getHeaders() }
    );
  }

  private buildFilterBody(filter?: DashboardFilter): Record<string, unknown> {
    const body: Record<string, unknown> = {
      empresasIds: filter?.empresasIds ?? [],
    };
    if (filter?.fechaDesde) body['fechaDesde'] = filter.fechaDesde;
    if (filter?.fechaHasta) body['fechaHasta'] = filter.fechaHasta;
    return body;
  }
}