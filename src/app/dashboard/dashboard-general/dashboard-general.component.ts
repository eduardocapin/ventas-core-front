import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ITablaDashboard } from 'src/app/models/tablaDashboard.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';
import { FilterService } from 'src/app/services/filter/filter.service';
import { forkJoin, Subscription } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { Empresa } from 'src/app/components/empresa-dropdown/empresa-dropdown.component';
import { LanguageService } from 'src/app/services/language/language.service';
import { TranslationService } from 'src/app/i18n/translation.service';

@Component({
  selector: 'mobentis-dashboard-general',
  templateUrl: './dashboard-general.component.html',
  styleUrls: ['./dashboard-general.component.scss'],
})
export class DashboardGeneralComponent implements OnDestroy {
  //Filtros
  selectedFilters: { [key: string]: any } = {};
  private languageSubscription?: Subscription;

  // Títulos traducidos
  dashboardTitle: string = '';
  clientsChartTitle: string = '';
  rejectionReasonsTitle: string = '';
  productFamiliesTitle: string = '';
  byMonthTitle: string = '';
  byWeekdayTitle: string = '';
  tableTotal: string = '';
  tableNoData: string = '';

  constructor(
    private rechazadosService: RechazadosService,
    private cdr: ChangeDetectorRef,
    private filterService: FilterService,
    private languageService: LanguageService,
    private translationService: TranslationService
  ) {
    this.data = this.valoresTablas[0];
  }

  cargando_grafica_clientes: boolean = true;
  datos_grafica_clientes: any = null;
  cargando_grafica_motivos: boolean = true;
  datos_grafica_motivos: any = null;
  cargando_grafica_familias: boolean = true;
  datos_grafica_familias: any = null;
  cargando_grafica_productos: boolean = true;
  datos_grafica_productos: any = null;
  cargando_grafica_mes: boolean = true;
  datos_grafica_mes: any = null;
  cargando_grafica_semana: boolean = true;
  datos_grafica_semana: any = null;
  cargando_grafica_s1: boolean = true;
  datos_grafica_s1: any = null;
  cargando_grafica_s2: boolean = true;
  datos_grafica_s2: any = null;
  cargando_grafica_s3: boolean = true;
  datos_grafica_s3: any = null;

  cargandoDatostabla: boolean = true;
  tablaActiva: number = 0;

  nombre_s1: string = 'Potencialidad 1'
  nombre_s2: string = 'Tipología 2'
  nombre_s3: string = 'Imagen 3'
  nombresTablas: string[] = [
    this.nombre_s1,
    this.nombre_s2,
    this.nombre_s3,
    'Clientes',
    'Provincias',
    'Poblaciones',
    'Familias',
    'Vendedores',
  ];
  /*
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
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Tienda Alimentacion Minorista(Super,China,Panad..)',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Bar/Tapas (No especializado)',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Mayoristas (Distribuidores, Cash, por mayor)',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Personal Empresa / Autoconsumo',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'Moderna',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Emblemática',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Tradicional',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'ANTONIO II - BAR',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'CUESTA - BAR',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'MANOLO - CAFETERIA PASTELERIA',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'MONCAYO - RTE.',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'MONTANA - CAFETERIA',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'NIBUR - CAFETERIA',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'RENAULT TRES CANTOS - BAR',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'SEVILLA - BAR',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'MADRID',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'ALCOBENDAS',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'SAN SEBASTIAN DE LOS REYES',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'TRES CANTOS',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'COLMENAR VIEJO',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'MADRID',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'Aceites',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Conservas Pescado',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Miel',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Fiambres / Embutidos',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Leche GLP',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Pasta',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Sal',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Vinagres',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'Zumos / Néctares',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
    [
      {
        nombre: 'MERCEDES MUÑIZ ALONSO',
        total: 10,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'FELIPE GARCILASO RIBERA',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
      {
        nombre: 'MIRIAM ALVAREZ MAS	',
        total: 20,
        rechazos: {
          Packaging: 2,
          'Mala Calidad': 0,
          Precio: 0,
          'No aplica': 0,
        },
      },
    ],
  ];*/
  valoresTablas: ITablaDashboard[][] = [[], [], [], [], [], [], [], []]
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
    // Inicializar traducciones inmediatamente
    this.updateTranslations();
    
    // Suscribirse a cambios de idioma
    this.languageSubscription = this.languageService.currentLanguage$.subscribe(() => {
      this.updateTranslations();
      // Forzar detección de cambios en toda la vista
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    });

    // Obtener la configuración de filtros desde el backend
    this.filterService.getFilterConfig('dashboard-general').subscribe(
      (config) => {
        this.empresaFieldName = config.empresaFieldName;
        console.log('Configuración de filtros obtenida:', config);
        this.applyEmpresaFilter(); // Aplicar filtro inicial con todas las empresas seleccionadas
        this.loadTableData();
      },
      (error) => {
        console.error('Error al obtener la configuración de filtros:', error);
        // Si hay error, usar el valor por defecto y continuar
        this.applyEmpresaFilter();
        this.loadTableData();
      }
    );
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

  async cargarGraficos() {

    // Carga Grafica Clientes
    this.cargando_grafica_clientes = true;
    this.rechazadosService
      .getClientsWithRejections(this.selectedFilters)
      .subscribe(
        (data) => {
          this.cargando_grafica_clientes = false;
          this.datos_grafica_clientes = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_clientes = false;
        }
      );

    this.cargando_grafica_motivos = true;
    this.rechazadosService
      .getRejectionGroupByReasons(this.selectedFilters)
      .subscribe(
        (data) => {
          this.cargando_grafica_motivos = false;
          this.datos_grafica_motivos = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_motivos = false;
        }
      );

    this.cargando_grafica_familias = true;
    this.rechazadosService
      .getRejectionGroupByFamily(this.selectedFilters, 6)
      .subscribe(
        (data) => {
          this.cargando_grafica_familias = false;
          this.datos_grafica_familias = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_familias = false;
        }
      );

    this.cargando_grafica_productos = true;
    this.rechazadosService
      .getRejectionGroupByProduct(this.selectedFilters, 10)
      .subscribe(
        (data) => {
          this.cargando_grafica_productos = false;
          this.datos_grafica_productos = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_productos = false;
        }
      );

    this.cargando_grafica_mes = true;
    this.rechazadosService
      .getRejectionGroupByMonth(this.selectedFilters)
      .subscribe(
        (data) => {
          this.cargando_grafica_mes = false;
          this.datos_grafica_mes = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_mes = false;
        }
      );

    this.cargando_grafica_semana = true;
    this.rechazadosService
      .getRejectionGroupByDayOfWeek(this.selectedFilters)
      .subscribe(
        (data) => {
          this.cargando_grafica_semana = false;
          this.datos_grafica_semana = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_semana = false;
        }
      );

    this.cargando_grafica_s1 = true;
    this.rechazadosService
      .getRejectionGroupByCustomerSegmentation(this.selectedFilters, 1)
      .subscribe(
        (data) => {
          this.cargando_grafica_s1 = false;
          this.datos_grafica_s1 = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_s1 = false;
        }
      );

    this.cargando_grafica_s2 = true;
    this.rechazadosService
      .getRejectionGroupByCustomerSegmentation(this.selectedFilters, 2)
      .subscribe(
        (data) => {
          this.cargando_grafica_s2 = false;
          this.datos_grafica_s2 = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_s2 = false;
        }
      );

    this.cargando_grafica_s3 = true;
    this.rechazadosService
      .getRejectionGroupByCustomerSegmentation(this.selectedFilters, 3)
      .subscribe(
        (data) => {
          this.cargando_grafica_s3 = false;
          this.datos_grafica_s3 = data;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando_grafica_s3 = false;
        }
      );
  }


  async cargarTablas() {
    try {
      const resultados = await firstValueFrom(
        forkJoin({
          s1: this.rechazadosService.getRejectionSummaryGroupByCustomerSegmentation(this.selectedFilters, 1),
          s2: this.rechazadosService.getRejectionSummaryGroupByCustomerSegmentation(this.selectedFilters, 1),
          s3: this.rechazadosService.getRejectionSummaryGroupByCustomerSegmentation(this.selectedFilters, 1),
          clientes: this.rechazadosService.getRejectionSummaryGroupByCustomer(this.selectedFilters),
          poblaciones: this.rechazadosService.getRejectionSummaryGroupByCity(this.selectedFilters),
          provincias: this.rechazadosService.getRejectionSummaryGroupByProvince(this.selectedFilters),
          familias: this.rechazadosService.getRejectionSummaryGroupByFamily(this.selectedFilters),
          vendedores: this.rechazadosService.getRejectionSummaryGroupBySalesman(this.selectedFilters),
        })
      );
  
      console.log('Resultados de todas las peticiones:', resultados);
  
      // Asignar los datos obtenidos
      this.nombre_s1 = resultados.s1.nombre_segmentacion;
      this.valoresTablas[0] = resultados.s1.valores;
      this.nombresTablas[0] = this.nombre_s1;
  
      this.nombre_s2 = resultados.s2.nombre_segmentacion;
      this.valoresTablas[1] = resultados.s2.valores;
      this.nombresTablas[1] = this.nombre_s2;
  
      this.nombre_s3 = resultados.s3.nombre_segmentacion;
      this.valoresTablas[2] = resultados.s3.valores;
      this.nombresTablas[2] = this.nombre_s3;
  
      this.valoresTablas[3] = resultados.clientes;
      this.valoresTablas[4] = resultados.poblaciones;
      this.valoresTablas[5] = resultados.provincias;
      this.valoresTablas[6] = resultados.familias;
      this.valoresTablas[7] = resultados.vendedores;
    } catch (error) {
      console.error('Error al cargar las tablas:', error);
    }
  }


  async loadTableData() {
    this.cargandoDatostabla = true;
    await this.cargarTablas()
    this.cargandoDatostabla = false;

    // Verifica si la tabla activa tiene valores. Si no tiene, asigna el índice de la primera tabla con valores.
    if (this.valoresTablas[this.tablaActiva].length === 0) {
      console.log('aaaa')
      // Encuentra el índice de la primera tabla con valores
      const indexConDatos = this.valoresTablas.findIndex(tabla => tabla.length > 0);
      console.log(indexConDatos)
      // Si se encuentra un índice válido, actualiza tablaActiva
      if (indexConDatos !== -1) {
        this.tablaActiva = indexConDatos;
      }
    }

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

  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginadorData = this.dataSource.data.slice(start, end);
  }

  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.loadTableData();
  }

  onFiltersChanged(selectedFilters: { [key: string]: any }) {
    console.log('Filtros seleccionados:', selectedFilters);
    this.selectedFilters = Object.values(selectedFilters);
    this.currentPage = 1;
    this.loadTableData();
    this.cargarGraficos();
  }

  selectedEmpresa: string | number = 'all';

  // Campo dinámico de empresa que se obtiene del backend
  empresaFieldName: string = 'r.empresa_id'; // valor por defecto

  // Controlar visibilidad del dropdown de empresas
  get isEmpresaDropdownVisible(): boolean {
    const enabled = localStorage.getItem('empresaDropdownEnabled');
    return enabled !== null ? enabled === 'true' : true;
  }

  // Lista de empresas para el selector múltiple
  empresasList: Empresa[] = [
    { id: 1, name: 'Sarigabo', selected: true },
    { id: 2, name: 'Coca Cola', selected: true },
    { id: 3, name: 'Mercadona', selected: true }
  ];

  // Método que se ejecuta cuando cambian las empresas seleccionadas
  onEmpresasChange(empresas: Empresa[]): void {
    this.empresasList = empresas;
    this.applyEmpresaFilter();
    this.cargarGraficos();
    this.loadTableData();
  }

  private applyEmpresaFilter(): void {
    // Usar el campo dinámico obtenido del backend
    const filters = Array.isArray(this.selectedFilters)
      ? [...this.selectedFilters]
      : Object.values(this.selectedFilters || {});

    const withoutEmpresa = filters.filter((f: any) => f?.id !== this.empresaFieldName);

    // Obtener empresas seleccionadas
    const empresasSeleccionadas = this.empresasList.filter(e => e.selected);

    // Si no están todas seleccionadas, agregar el filtro
    if (empresasSeleccionadas.length > 0 && empresasSeleccionadas.length < this.empresasList.length) {
      withoutEmpresa.push({
        id: this.empresaFieldName,
        nombre: 'Empresa',
        tipo: 'multi-select',
        valor: empresasSeleccionadas.map(e => ({
          id: e.id,
          name: e.name
        }))
      });
    }

    this.selectedFilters = withoutEmpresa;
  }

  private updateTranslations(): void {
    this.dashboardTitle = this.translationService.t('dashboard.title');
    this.clientsChartTitle = this.translationService.t('chart.clients.title');
    this.rejectionReasonsTitle = this.translationService.t('chart.rejectionReasons.title');
    this.productFamiliesTitle = this.translationService.t('chart.productFamilies.title');
    this.byMonthTitle = this.translationService.t('chart.byMonth.title');
    this.byWeekdayTitle = this.translationService.t('chart.byWeekday.title');
    this.tableTotal = this.translationService.t('table.total');
    this.tableNoData = this.translationService.t('table.noData');
  }

  ngOnDestroy(): void {
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }
  }
}
