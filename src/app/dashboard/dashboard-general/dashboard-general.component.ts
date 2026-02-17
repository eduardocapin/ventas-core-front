import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TranslationService } from 'src/app/core/services/i18n/translation.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { Empresa } from 'src/app/core/components/empresa-dropdown/empresa-dropdown.component';
import { DashboardService, TopCliente, TopProducto, TopPedido } from '../dashboard.service';
import { catchError } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'mobentis-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
})
export class DashboardGeneralComponent implements OnInit {
  selectedEmpresasIds: number[] = [];

  /** Rango de fechas para filtrar las gráficas. Por defecto: último año hasta hoy. */
  fechaDesde: Date;
  fechaHasta: Date;

  // Datos para las gráficas
  topClientes: TopCliente[] = [];
  topProductos: TopProducto[] = [];
  topPedidos: TopPedido[] = [];

  // IDs únicos para las gráficas
  graficaClientesId = 'grafica-top-clientes-' + Math.random().toString(36).substr(2, 9);
  graficaProductosId = 'grafica-top-productos-' + Math.random().toString(36).substr(2, 9);
  graficaPedidosId = 'grafica-top-pedidos-' + Math.random().toString(36).substr(2, 9);

  // Datos formateados para las gráficas
  clientesCategorias: string[] = [];
  clientesValores: number[] = [];

  productosCategorias: string[] = [];
  productosValores: number[] = [];

  pedidosCategorias: string[] = [];
  pedidosValores: number[] = [];

  /** Totales numéricos para los KPIs (se actualizan al cargar datos) */
  totalValorClientesNum = 0;
  totalValorProductosNum = 0;
  totalValorPedidosNum = 0;

  loading = false;

  /** Control de visibilidad de los KPIs (igual que en importador de documentos) */
  kpisColapsados = false;

  /** IDs de las secciones para scroll al hacer clic en un KPI */
  readonly sectionIdClientes = 'dashboard-grafica-clientes';
  readonly sectionIdProductos = 'dashboard-grafica-productos';
  readonly sectionIdPedidos = 'dashboard-grafica-pedidos';

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) {
    const hoy = new Date();
    const haceUnAnio = new Date(hoy);
    haceUnAnio.setFullYear(haceUnAnio.getFullYear() - 1);
    this.fechaDesde = haceUnAnio;
    this.fechaHasta = hoy;
  }

  /** Total valor de los top 10 clientes (resumen para KPI) */
  get totalValorClientes(): number {
    return this.totalValorClientesNum;
  }

  /** Total valor de los top 10 productos (resumen para KPI) */
  get totalValorProductos(): number {
    return this.totalValorProductosNum;
  }

  /** Total valor de los top 10 pedidos (resumen para KPI) */
  get totalValorPedidos(): number {
    return this.totalValorPedidosNum;
  }

  /** Formatea el total para mostrar en KPI (siempre devuelve un string visible) */
  formatTotal(value: number): string {
    const n = value != null ? Number(value) : 0;
    return n.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /** Navega a la gráfica correspondiente al hacer clic en un KPI */
  scrollToGrafica(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Alterna el estado de colapso de los KPIs (igual que en importador de documentos) */
  toggleKpisColapsados(): void {
    this.kpisColapsados = !this.kpisColapsados;
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  onEmpresasChange(empresas: Empresa[]): void {
    // Extraer solo los IDs de las empresas seleccionadas
    this.selectedEmpresasIds = empresas
      .filter(e => e.selected)
      .map(e => e.id);
    
    // Recargar datos del dashboard cuando cambian las empresas
    this.loadDashboardData();
  }

  /** Fecha "desde" en ISO (inicio del día en local). */
  get fechaDesdeISO(): string {
    return this.dateToISOStartOfDay(this.fechaDesde);
  }

  /** Fecha "hasta" en ISO (fin del día en local). */
  get fechaHastaISO(): string {
    return this.dateToISOEndOfDay(this.fechaHasta);
  }

  private dateToISOStartOfDay(d: Date): string {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x.toISOString();
  }

  private dateToISOEndOfDay(d: Date): string {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x.toISOString();
  }

  onRangoFechasChange(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    const empresasIds = this.selectedEmpresasIds.length > 0 ? this.selectedEmpresasIds : undefined;
    const filter = {
      empresasIds,
      fechaDesde: this.fechaDesdeISO,
      fechaHasta: this.fechaHastaISO,
    };

    // Inicializar arrays y totales
    this.clientesCategorias = [];
    this.clientesValores = [];
    this.productosCategorias = [];
    this.productosValores = [];
    this.pedidosCategorias = [];
    this.pedidosValores = [];
    this.totalValorClientesNum = 0;
    this.totalValorProductosNum = 0;
    this.totalValorPedidosNum = 0;

    const clientes$ = this.dashboardService.getTop10Clientes(filter).pipe(
      catchError(err => { console.error('Error top clientes:', err); return of({ items: [] }); })
    );
    const productos$ = this.dashboardService.getTop10Productos(filter).pipe(
      catchError(err => { console.error('Error top productos:', err); return of({ items: [] }); })
    );
    const pedidos$ = this.dashboardService.getTop10Pedidos(filter).pipe(
      catchError(err => { console.error('Error top pedidos:', err); return of({ items: [] }); })
    );

    forkJoin({ clientes: clientes$, productos: productos$, pedidos: pedidos$ }).subscribe(({ clientes, productos, pedidos }) => {
      this.topClientes = clientes.items || [];
      this.clientesCategorias = this.topClientes.map(c => c.nombreCliente || 'Sin nombre');
      this.clientesValores = this.topClientes.map(c => Number(c.valorTotal) || 0);
      this.totalValorClientesNum = this.clientesValores.reduce((a, b) => a + b, 0);

      this.topProductos = productos.items || [];
      this.productosCategorias = this.topProductos.map(p => (p.descripcion || p.referencia || 'Sin descripción').substring(0, 30));
      this.productosValores = this.topProductos.map(p => Number(p.valorTotal) || 0);
      this.totalValorProductosNum = this.productosValores.reduce((a, b) => a + b, 0);

      this.topPedidos = pedidos.items || [];
      this.pedidosCategorias = this.topPedidos.map(p => {
        const label = `${p.numero || 'Sin número'} - ${(p.nombreCliente || 'Sin cliente').substring(0, 20)}`;
        return label.length > 40 ? label.substring(0, 40) + '...' : label;
      });
      this.pedidosValores = this.topPedidos.map(p => Number(p.valorTotal) || 0);
      this.totalValorPedidosNum = this.pedidosValores.reduce((a, b) => a + b, 0);

      this.loading = false;
      this.cdr.detectChanges();
    });
  }
}
