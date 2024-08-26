import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterService } from 'src/app/services/filter/filter.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

import { GraficaClientesComponent } from 'src/app/components/grafica-clientes/grafica-clientes.component';
import { GraficaPedidosDiaComponent } from 'src/app/components/grafica-pedidos-dia/grafica-pedidos-dia.component';
import { GraficaPedidosComponent } from 'src/app/components/grafica-pedidos/grafica-pedidos.component';
import { GraficaPedidosFamiliasProductosComponent } from 'src/app/components/grafica-pedidos-familias-productos/grafica-pedidos-familias-productos.component';
import { GraficaPedidosMesComponent } from 'src/app/components/grafica-pedidos-mes/grafica-pedidos-mes.component';
import { GraficaPedidosSegmentacion1Component } from 'src/app/components/grafica-pedidos-segmentacion1/grafica-pedidos-segmentacion1.component';
import { GraficaPedidosSegmentacion2Component } from 'src/app/components/grafica-pedidos-segmentacion2/grafica-pedidos-segmentacion2.component';
import { GraficaPedidosSegmentacion3Component } from 'src/app/components/grafica-pedidos-segmentacion3/grafica-pedidos-segmentacion3.component';
import { GraficaProductosTopComponent } from 'src/app/components/grafica-productos-top/grafica-productos-top.component';
import { ITablaDashboard } from 'src/app/models/tablaDashboard.model';
import { IFiltroAgente } from 'src/app/models/filtroAgente.model';
import { ISegmentacion } from 'src/app/models/segmentacion.model';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
})
export class DashboardGeneralComponent {
  filtro: any;
  fechaHoy = new Date();
  fechaHaceUnAnio = new Date(
    this.fechaHoy.getFullYear() - 1,
    this.fechaHoy.getMonth(),
    this.fechaHoy.getDate()
  );
  range = new FormGroup({
    start: new FormControl(this.fechaHaceUnAnio),
    end: new FormControl(this.fechaHoy),
  });
  //Filtros
  familiaList: string[] = ['Aceites', 'Aceitunas / Encurtidos', 'Adhesivos', 'Agua GLP', 'Arroces','Azucar / Chocolate','Bombones','Cafés','Camisas Hombre','Cárnicos','Cereales Desayuno','Conservas Fruta','Conservas Pescado','Conservas Vegetales','Culinarios','Embutidos CF','Ensaladas CF','Ensaladas Salteadas','Espec. Banquetes','Especias','Fiambres / Embutidos','Huevo Derivados','Jamones','Jardín / Hogar','Leche GLP','Legumbres','Miel','Motor','Pantalones Hombre','Pasta','Quesos','Sal','Salsas','Verduras','Vinagres','Zumos / Néctares','Zumos GLP'];
  agenteList: IFiltroAgente[] = [{id: 0,name: 'FELIPE GARCILASO RIBERA'}, {id: 1,name: 'GUSTAVO BLANCO MORENO'}, {id: 2,name: 'FMERCEDES MUÑIZ ALONSO'},{id: 4,name: 'MIRIAM ALVAREZ MAS'}];
  poblacionList: string[] = ['ALALPARDO','ALCALA DE HENARES','ALCOBENDAS','ALCORCON','ALDEA SANTILLANA','ALGETE','ARANDA DE DUERO','ARAVACA','ARGANDA DEL REY','ARROYOMOLINOS','AVILA','BELVIS DEL JARAMA','BOADILLA DEL MONTE','BOECILLO','CAMARMA DE ESTERUELAS','CAMBEO','CAMPOREAL','CERCEDA','CIEMPOZUELOS','CIFUENTES','COBEÑA','COBISA','COLLADO VILLALBA','COLMENAR DE OREJA','COLMENAR VIEJO','COMENAR VIEJO','COSLADA','DAGANZO','DON BENITO','EL CASAR','EL MOLAR','EL PLANTIO','EL TIEMBLO','EL VELLON','ESTREMERA','FUENLABRADA','FUENTE EL FRESNO','FUENTE EL SAZ','FUENTE EL SAZ DE JARAMA','FUENTE EL SAZ DEL JARAMA','GALAPAGAR','GETAFE','GUADALAJARA','GUADALIX DE LA SIERRA','GUADARRAMA','ISLA DE LA TOJA','LA CABRERA','LA VALL D´UIXO','LAS ROZAS','LEGANES','LOECHES','LOS HUEROS - VILLALBILLA','LOZOYUELA','MADRID','MAJADAHONDA','MAJADAHONDA','MANGIRON-PUENTES VIEJAS','MANZANARES DEL REAL','MANZANARES EL REAL','MATALPINO','MONDEJAR','MORALZARZAL','NAVACERRADA','NAVAGALAMELLA','NAVALAFUENTE','NULES','OLIAS DEL REY','ONDA','OTERO DE HERREROS','PELAYOS DE LA PRESA','PEZUELA DE LAS TORRES','PIOZ','POZOAMARGO','POZUELO DE ALARCON','RIVAS VACIAMADRID','ROA','S.S.REYES','SAN AGUSTIN DE GUADALIX','SAN FERNANDO DE HENARES','SAN MARTIN DE LA VEGA','SAN RAFAEL','SAN SEBASTIAN  DE LOS REYES','SANTOS DE LA HUMOSA','SESEÑA','SEVILLA LA NUEVA','SIGUENZA','SOTO DEL REAL','TOLEDO','TORREJON DE ARDOZ','TORRELAGUNA','TORREMOCHA DE JARAMA','TRES CANTOS','VALDETORRES DEL JARAMA','VALL DE UXO','VILLANUEVA DE ALCARDETE','VILLENA','ZARAGOZA','ZARZALEJO'];
  provinciaList: string[] = ['ALICANTE','AVILA','BADAJOZ','BURGOS','CANTABRIA','CASTELLON','CUENCA','GUADALAJARA','MADRID','ORENSE','PONTEVEDRA','SEGOVIA','TOLEDO','VALLADOLID','ZARAGOZA'];
  s1: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'A  (> 5.000 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'B  (Entre 2.500 - 4.999 euros/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'C  (Entre 1.000 y 2.499 €/mes)',name: 'Potenciabilidad'},{segmentation_value_id: 12,segmentation_value: 'D ( < 1.000 euros) ',name: 'Potenciabilidad'}];
  s2: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'Bar/Tapas  (No especializado)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Cerveceria / Cafeteria  (Especializado)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restaurante Independiente (Incluye catering)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Noche (Disco, Pubs, Bar de copas) ',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restauracion organizada: Franquicias, Tematicos',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Hoteles, Hostales, posadas',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'OCIO (Deporte,Cines,Teatro,Salon Juegos,..)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Colectividades:comedor empresa, Enseñanza,Admin,',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Tienda Alimentacion Minorista(Super,China,Panad..)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Tienda Impulso(F Secos,Chuches,Estanco,Vending',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Mayoristas (Distribuidores, Cash, por mayor)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Restauracion en Ruta(aeropuerto,E.S. Carreteras)',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Personal Empresa / Autoconsumo',name: 'Tipologia'},{segmentation_value_id: 12,segmentation_value: 'Alquiler',name: 'Tipologia'}];
  s3: ISegmentacion[] = [{segmentation_value_id: 11,segmentation_value: 'Tradicional',name: 'Imagen'},{segmentation_value_id: 12,segmentation_value: 'Moderna',name: 'Imagen'},{segmentation_value_id: 12,segmentation_value: 'Emblemática',name: 'Imagen'}];
  constructor(
    private dateAdapter: DateAdapter<any>,
    private _filterServices: FilterService,
    private fb: FormBuilder,
    private graficaClientes: GraficaClientesComponent,
    private graficaPedidos: GraficaPedidosComponent,
    private graficaPedidosDia: GraficaPedidosDiaComponent,
    private graficaPedidosSegmentacion1: GraficaPedidosSegmentacion1Component,
    private graficaPedidosSegmentacion2: GraficaPedidosSegmentacion2Component,
    private graficaPedidosSegmentacion3: GraficaPedidosSegmentacion3Component,
    private graficaPedidosFamiliasProductos: GraficaPedidosFamiliasProductosComponent,
    private graficaPedidosMes: GraficaPedidosMesComponent,
    private graficaTopProductos: GraficaProductosTopComponent,
    private paginatorIntl: MatPaginatorIntl
  ) {
    this.configurePaginatorLabels();
    this.dateAdapter.setLocale('es');
    this.filtro = this.fb.group({
      cliente: [],
      provinciaFilterControl: [],
      segmentacion1FilterControl: [],
      segmentacion2FilterControl: [],
      segmentacion3FilterControl: [],
      poblacionFilterControl: [],
      agenteFilterControl: [],
      familiaFilterControl: [],
    });
    this.data = this.valoresTablas[0]
  }

  isPedidosActive: boolean = true;
  isFiltroActive: boolean = false;
  cargandoDatostabla: boolean = true;
  tablaActiva: number = 0;
  nombresTablas: string[] = [
    'Potenciabilidad',
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
      { nombre: 'B (Entre 2.500 - 4.999 euros/mes)', total: 455, rechazos: { 'Mal estado':245, 'Producto no trabajado': 0,  'Mala Calidad': 210 , 'Mejor precio competencia': 0} },
      { nombre: 'A (> 5.000 euros/mes)', total: 320, rechazos: { 'Mal estado': 100, 'Producto no trabajado': 90,  'Mala Calidad': 110 , 'Mejor precio competencia': 20} },
      { nombre: 'D ( < 1.000 euros)', total: 200, rechazos: { 'Mal estado': 100, 'Producto no trabajado': 0,  'Mala Calidad': 75 , 'Mejor precio competencia': 25} },
      { nombre: 'C  (Entre 1.000 y 2.499 €/mes)', total: 120, rechazos: { 'Mal estado': 50, 'Producto no trabajado': 20,  'Mala Calidad': 35 , 'Mejor precio competencia': 15}},
    ],
    [
      { nombre: 'OCIO (Deporte,Cines,Teatro,Salon Juegos,..)', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Tienda Alimentacion Minorista(Super,China,Panad..)', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Bar/Tapas (No especializado)', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Mayoristas (Distribuidores, Cash, por mayor)', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0}},
      { nombre: 'Personal Empresa / Autoconsumo', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'Moderna', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Emblemática', total: 20, rechazos:{ 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Tradicional', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'ANTONIO II - BAR', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'CUESTA - BAR', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'MANOLO - CAFETERIA PASTELERIA', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'MONCAYO - RTE.', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'MONTANA - CAFETERIA', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'NIBUR - CAFETERIA', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'RENAULT TRES CANTOS - BAR', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'SEVILLA - BAR', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'MADRID', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'ALCOBENDAS', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'SAN SEBASTIAN DE LOS REYES', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'TRES CANTOS', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'COLMENAR VIEJO', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'MADRID', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'Aceites', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Conservas Pescado', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Miel', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Fiambres / Embutidos', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Leche GLP', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Pasta', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Sal', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Vinagres', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'Zumos / Néctares', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
    [
      { nombre: 'MERCEDES MUÑIZ ALONSO', total: 10, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'FELIPE GARCILASO RIBERA', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
      { nombre: 'MIRIAM ALVAREZ MAS	', total: 20, rechazos: { 'Mal estado': 2, 'Producto no trabajado': 0,  'Mala Calidad': 0 , 'Mejor precio competencia': 0} },
    ],
  ];
  columnasDinamicas: string[] = ['nombre', 'total']; // Columnas por defecto
  columnasRechazos: string[] = []; // Columnas por defecto
  data: ITablaDashboard[] = [
    // más datos
  ];
  // KPI
  totalClientes: number = 0;
  attCliente: number = 0;
  totalPedidos: number = 0;
  pedidosDia: number = 0;
  ventasDia: number = 0;
  totalVentas: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<ITablaDashboard>(this.data);

  ngOnInit(): void {
    this.cargarFiltros();
    this.generarColumnasDinamicas();
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
    
    this.columnasDinamicas = ['nombre', 'total',...Array.from(rechazosTipos)];
    this.columnasRechazos = [...Array.from(rechazosTipos)]
    console.log(this.columnasDinamicas)
    this.dataSource.data = this.data;
    console.log(this.dataSource.data)
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
    this.cargarGraficosFiltrados();
  }

  cargarGraficosFiltrados() {
    /* let fechaHoy = new Date();
    let fechaFin = fechaHoy.getFullYear() + "-" + (fechaHoy.getMonth() + 1) + "-" + fechaHoy.getDate();
    let fechaInicio = (fechaHoy.getFullYear() - 1) + "-" + (fechaHoy.getMonth() + 1) + "-" + fechaHoy.getDate();

    if (this.range.value.end) {
      fechaFin = this.range.value.end.getFullYear() + "-" + (this.range.value.end.getMonth() + 1) + "-" + this.range.value.end.getDate();
    }
    if (this.range.value.start) {
      fechaInicio = this.range.value.start.getFullYear() + "-" + (this.range.value.start.getMonth() + 1) + "-" + this.range.value.start.getDate();
    }

    // Carga Segmentacion 1
 
        this.graficaPedidosSegmentacion1.pintarGrafica();


    // Carga Segmentacion 2

        this.graficaPedidosSegmentacion2.pintarGrafica();


    // Carga Segmentacion 3

        this.graficaPedidosSegmentacion3.pintarGrafica();


    // Carga grafica FAMILIAS

        this.graficaPedidosFamiliasProductos.pintarGrafica();


    // Carga Segmentacion 1 VENTAS

        this.graficaVentasSegmentacion1.pintarGrafica();


    // Carga Segmentacion 2 VENTAS

        this.graficaVentasSegmentacion2.pintarGrafica();


    // Carga Segmentacion 3 VENTAS

        this.graficaVentasSegmentacion3.pintarGrafica();


    // Carga grafica FAMILIAS ventas

        this.graficaVentasFamiliasProductos.pintarGrafica()


    // Carga grafica pedidos mes 

        this.graficaPedidosMes.pintarGrafica()


    // Carga grafica pedidos mes ventas

        this.graficaVentasMes.pintarGrafica()


    // Carga grafica pedidos dia 

        this.graficaPedidosDia.pintarGrafica()


    // Carga grafica pedidos dia ventas

        this.graficaVentasDia.pintarGrafica()


    // Carga grafica pedidos hora

        this.graficaPedidosHora.pintarGrafica()


    // Carga grafica pedidos hora ventas

        this.graficaVentasHora.pintarGrafica()


     // Carga grafica top pedidos
     this._dashboardServices.getTopProductos(fechaInicio, fechaFin, this.filtro).subscribe(
      (data) => {
        this.graficaTopProductos.pintarGrafica(data)
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );

    // Carga grafica pedidos hora ventas
    this._dashboardServices.getTopProductosVentas(fechaInicio, fechaFin, this.filtro).subscribe(
      (data) => {
        this.graficaTopProductosVentas.pintarGrafica(data)
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    ); */
  }

  cargarFiltros() {
    /* this._filterServices.getPoblaciones().subscribe(
      (data) => {
        data.forEach((p) => this.poblacionList.push(p.name));
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );
    // Carga filtro provincia
    this._filterServices.getProvincias().subscribe(
      (data) => {
        data.forEach((p) => this.provinciaList.push(p.name));
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );
    // Carga filtro Familias
    this._filterServices.getFamilias().subscribe(
      (data) => {
        data.forEach((f) => this.familiaList.push(f.family));
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );

    // Carga filtro vendedores
    this._filterServices.getAgentes().subscribe(
      (data) => {
        this.agenteList = data;
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );
    // Carga filtro segmentacion 1
    this._filterServices.getSegmentacion1().subscribe(
      (data) => {
        this.s1 = data;
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );
    // Carga filtro segmentacion 2
    this._filterServices.getSegmentacion2().subscribe(
      (data) => {
        this.s2 = data;
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    );
    // Carga filtro segmentacion 3
    this._filterServices.getSegmentacion3().subscribe(
      (data) => {
        this.s3 = data;
      },
      (error) => {
        console.error('Error al asignar el dataSource:', error);
      }
    ); */
  }

  applyFilter() {
    this.cargarGraficosFiltrados();
    this.toggleFiltro();
  }

  resetFilter() {
    console.log('resetear');
    this.range.reset();
    this.filtro.reset();
    this.cargarGraficosFiltrados();
    this.toggleFiltro();
  }

  //!!!!!! mirar a ver si esto se puede hacer mejor que con un timeout
  togglePedidosSales() {
    this.isPedidosActive = !this.isPedidosActive;
    setTimeout(() => {
      this.resizeGraficas();
    }, 1);
  }

  toggleFiltro() {
    this.isFiltroActive = !this.isFiltroActive;
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

  select(tablaActiva: number) {
    console.log(tablaActiva);
    console.log(this.valoresTablas[tablaActiva]);
    this.dataSource.data = this.valoresTablas[tablaActiva];
    this.data = this.valoresTablas[tablaActiva];
    this.generarColumnasDinamicas();
  }
  private configurePaginatorLabels() {
    this.paginatorIntl.itemsPerPageLabel = 'Elementos por página';
    this.paginatorIntl.nextPageLabel = 'Página siguiente';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginatorIntl.changes.next();
  }
}

