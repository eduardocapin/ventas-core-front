import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { GraficaClientesComponent } from 'src/app/components/grafica-clientes/grafica-clientes.component';
import { GraficaPedidosDiaComponent } from 'src/app/components/grafica-pedidos-dia/grafica-pedidos-dia.component';
import { GraficaMotivosComponent } from 'src/app/components/grafica-motivos/grafica-motivos.component';
import { GraficaPedidosFamiliasProductosComponent } from 'src/app/components/grafica-pedidos-familias-productos/grafica-pedidos-familias-productos.component';
import { GraficaPedidosMesComponent } from 'src/app/components/grafica-pedidos-mes/grafica-pedidos-mes.component';
import { GraficaPedidosSegmentacion1Component } from 'src/app/components/grafica-pedidos-segmentacion1/grafica-pedidos-segmentacion1.component';
import { GraficaPedidosSegmentacion2Component } from 'src/app/components/grafica-pedidos-segmentacion2/grafica-pedidos-segmentacion2.component';
import { GraficaPedidosSegmentacion3Component } from 'src/app/components/grafica-pedidos-segmentacion3/grafica-pedidos-segmentacion3.component';
import { GraficaProductosTopComponent } from 'src/app/components/grafica-productos-top/grafica-productos-top.component';
import { ITablaDashboard } from 'src/app/models/tablaDashboard.model';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
})
export class DashboardGeneralComponent {

  //Filtros
  selectedFilters: { [key: string]: any } = {};

  constructor(
    private graficaClientes: GraficaClientesComponent,
    private graficaPedidos: GraficaMotivosComponent,
    private graficaPedidosDia: GraficaPedidosDiaComponent,
    private graficaPedidosSegmentacion1: GraficaPedidosSegmentacion1Component,
    private graficaPedidosSegmentacion2: GraficaPedidosSegmentacion2Component,
    private graficaPedidosSegmentacion3: GraficaPedidosSegmentacion3Component,
    private graficaPedidosFamiliasProductos: GraficaPedidosFamiliasProductosComponent,
    private graficaPedidosMes: GraficaPedidosMesComponent,
    private graficaTopProductos: GraficaProductosTopComponent
  ) {

    this.data = this.valoresTablas[0];
  }

  cargandoDatostabla: boolean = true;
  tablaActiva: number = 0;
  nombresTablas: string[] = [
    'Potencialidad',
    'Tipología',
    'Imagen',
    'Clientes',
    'Provincias',
    'Poblaciones',
    'Familias',
    'Vendedores',
  ];
  valoresTablas: ITablaDashboard[][] = [
    [
      {
        nombre: 'B (Entre 2.500 - 4.999 euros/mes)',
        total: 15.005,
        rechazos: {
          Packaging: 245,
          'Mala Calidad': 210,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'A (> 5.000 euros/mes)',
        total: 32.522,
        rechazos: {
          Packaging: 100,
          'Mala Calidad': 110,
          Precio: 90,
          'No aplica': 20,
        },
      },
      {
        nombre: 'D ( < 1.000 euros)',
        total: 8.123,
        rechazos: {
          Packaging: 100,
          'Mala Calidad': 75,
          Precio: 0,
          'No aplica': 25,
        },
      },
      {
        nombre: 'C  (Entre 1.000 y 2.499 €/mes)',
        total: 11.211,
        rechazos: {
          Packaging: 50,
          'Mala Calidad': 35,
          Precio: 20,
          'No aplica': 15,
        },
      },
    ],
    [
      {
        nombre: 'OCIO (Deporte,Cines,Teatro,Salon Juegos,..)',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Tienda Alimentacion Minorista(Super,China,Panad..)',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Bar/Tapas (No especializado)',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Mayoristas (Distribuidores, Cash, por mayor)',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Personal Empresa / Autoconsumo',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'Moderna',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Emblemática',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Tradicional',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'ANTONIO II - BAR',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'CUESTA - BAR',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'MANOLO - CAFETERIA PASTELERIA',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'MONCAYO - RTE.',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'MONTANA - CAFETERIA',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'NIBUR - CAFETERIA',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'RENAULT TRES CANTOS - BAR',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'SEVILLA - BAR',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'MADRID',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'ALCOBENDAS',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'SAN SEBASTIAN DE LOS REYES',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'TRES CANTOS',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'COLMENAR VIEJO',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'MADRID',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'Aceites',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Conservas Pescado',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Miel',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Fiambres / Embutidos',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Leche GLP',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Pasta',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Sal',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Vinagres',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'Zumos / Néctares',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
    [
      {
        nombre: 'MERCEDES MUÑIZ ALONSO',
        total: 10,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'FELIPE GARCILASO RIBERA',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
      {
        nombre: 'MIRIAM ALVAREZ MAS	',
        total: 20,
        rechazos: { Packaging: 2, 'Mala Calidad': 0, Precio: 0, 'No aplica': 0 },
      },
    ],
  ];
  columnasDinamicas: string[] = ['nombre', 'total']; // Columnas por defecto
  columnasRechazos: string[] = []; // Columnas por defecto
  data: ITablaDashboard[] = [
    // más datos
  ];
  // paginacion
  paginadorData: ITablaDashboard[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 0;
  // KPI
  totalClientes: number = 0;
  attCliente: number = 0;
  totalPedidos: number = 0;
  pedidosDia: number = 0;
  ventasDia: number = 0;
  totalVentas: number = 0;

  dataSource = new MatTableDataSource<ITablaDashboard>(this.data);

  ngOnInit(): void {
    this.loadTableData();
    
  }

  ngAfterViewInit() {
    this.cargarGraficos();
  }

  generarColumnasDinamicas(): void {
    const rechazosTipos: Set<string> = new Set();
    // Detectar los tipos de rechazos presentes en los datos
    this.data.forEach((item) => {
      if (item.rechazos) {
        Object.keys(item.rechazos).forEach((tipo) => {
          if (item.rechazos[tipo] > 0) {
            rechazosTipos.add(tipo);
          }
        });
      }
    });

    // Añadir las columnas dinámicas basadas en los tipos de rechazos presentes
    this.columnasDinamicas = ['nombre', 'total', ...Array.from(rechazosTipos)];
    this.columnasRechazos = [...Array.from(rechazosTipos)];
    this.dataSource.data = this.data;
  }

  cargarGraficos() {
    // Carga KPI

    this.totalClientes = 1;
    this.attCliente = 2;
    this.totalPedidos = 3;
    this.pedidosDia = 4;
    this.ventasDia = Math.floor(5);
    this.totalVentas = Math.floor(6);

    // Carga Grafica Clientes

    this.graficaClientes.pintarGrafica();
    this.graficaPedidos.pintarGrafica();
    this.graficaPedidosSegmentacion1.pintarGrafica();
    this.graficaPedidosSegmentacion2.pintarGrafica();
    this.graficaPedidosSegmentacion3.pintarGrafica();
    this.graficaPedidosFamiliasProductos.pintarGrafica();
    this.graficaTopProductos.pintarGrafica();
    this.graficaPedidosMes.pintarGrafica();
    this.graficaPedidosDia.pintarGrafica();
  }
  
  onResize() {
    this.resizeGraficas();
  }

  resizeGraficas() {
    this.graficaClientes.resize();
    this.graficaPedidos.resize();
    this.graficaPedidosDia.resize();
    this.graficaPedidosSegmentacion1.resize();
    this.graficaPedidosSegmentacion2.resize();
    this.graficaPedidosSegmentacion3.resize();
    this.graficaPedidosFamiliasProductos.resize();
    this.graficaPedidosMes.resize();
    this.graficaTopProductos.resize();
  }

  loadTableData() {
    console.log(`Tabla activa seleccionada: ${this.tablaActiva}`);
    console.log(
      `Datos de la tabla seleccionada:`,
      this.valoresTablas[this.tablaActiva]
    );
    // Actualiza los datos
    this.currentPage = 1;
    this.dataSource.data = this.valoresTablas[this.tablaActiva];
    this.data = this.valoresTablas[this.tablaActiva];

    // Generar las columnas dinámicas

    this.generarColumnasDinamicas();
    this.totalPages = Math.ceil(
      this.dataSource.data.length / this.itemsPerPage
    );
    this.paginate();
    console.log(this.dataSource.data);
  }

  select(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.tablaActiva = +target.value;
      this.loadTableData();
    }
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.paginate();
  }

  paginate
  () {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginadorData = this.dataSource.data.slice(start, end);
  }

  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadTableData()
  }

  onFiltersChanged(selectedFilters: { [key: string]: any }) {
    console.log('Filtros seleccionados:', selectedFilters);
    this.selectedFilters = selectedFilters;
    this.currentPage = 1;
    this.loadTableData();
  }
}
