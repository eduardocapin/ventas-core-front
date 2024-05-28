import { AfterViewInit, Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export interface UserData {
  id: string;
  estado: string;
  poblacion: string;
  provincia: string;
  cliente: string;
  producto: string;
  familia: string;
  subfamilia: string;
  rechazo: string;
  pvp: number;
  comp: number;
  competidor: string;
  accionPrecioPorcentaje: number;
  accionCorrectora: string;
  editingAccionCorrectora?: boolean;
  propuestaAgente: string;
  latitud: number;
  longitud: number;
  symbol: string;
}

const PROVINCIAS: string[] = [
  'Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres',
  'Cádiz', 'Cantabria', 'Castellón', 'Ciudad Real', 'Córdoba', 'La Coruña', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara',
  'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga',
  'Murcia', 'Navarra', 'Orense', 'Palencia', 'Las Palmas', 'Pontevedra', 'La Rioja', 'Salamanca', 'Segovia', 'Sevilla', 'Soria',
  'Tarragona', 'Santa Cruz de Tenerife', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'
];

const POBLACIONES: string[] = [
  'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas de Gran Canaria', 'Bilbao',
  'Alicante', 'Córdoba', 'Valladolid', 'Vigo', 'Gijón', 'Hospitalet de Llobregat', 'Vitoria-Gasteiz', 'La Coruña', 'Granada', 'Elche',
  'Oviedo', 'Santa Cruz de Tenerife', 'Pamplona', 'Cartagena', 'Sabadell', 'Jerez de la Frontera', 'Móstoles', 'Santander', 'Alcalá de Henares', 'Fuenlabrada',
  'Legánes', 'San Sebastián', 'Getafe', 'Burgos', 'Albacete', 'Alcorcón', 'Almería', 'Donostia-San Sebastián', 'Castellón de la Plana', 'Logroño', 'Badajoz',
  'La Laguna', 'Salamanca', 'Huelva', 'Marbella', 'Lérida', 'Tarragona', 'Dos Hermanas', 'Torrejón de Ardoz', 'Parla', 'Mataró'
];

const RECHAZO: string[] = [
  'Mal estado',
  'Mejor precio competencia',
  'Producto no trabajado',
  'Mala calidad',
];
const COMPETIDOR: string[] = [
  'Distribuciones Rico',
  'Cadea 100 Profesional',
  'Bazar Hogar',
];

const ACCIONCORRECTORA: string[] = [
  'Promoción 2x1',
  'Aplicar campaña trimestral',
  'Promoción 1+1',
  'Promoción 3x2',
  'Regalo de cartelería de publicidad',
  'Lanzar promoción 3x2',
];

const CLIENTES: string[] = [
  'Mercadona',
  'Alimerka',
  'Eroski',
  'MasYMas',
  'Carrefour',
  'Lidl',
  'Aldi',
  'Dia',
  'Supercor',
  'Hipercor',
  'Ahorramás',
  'BM Supermercados',
  'Bonpreu',
  'Caprabo',
  'Condis',
  'El Corte Inglés',
  'Froiz',
  'Gadis',
  'La Plaza de DIA',
  'Lupa',
  'Simply',
  'Superdino',
  'SuperSol',
  'Ulabox',
  'Consum',
  'HiperDino'
];

const NAMES: string[] = [
  'Delicias Ibéricas',
  'Sabores Andaluces',
  'Quesos Artesanos',
  'Bebidas Mediterráneas',
  'Frutas Frescas',
  'Aceites Gourmet',
  'Cervezas Artesanales',
  'Golosinas Españolas',
  'Sabor Natural',
  'Vinos Selectos',
  'Carnes Premium',
  'Dulces Caseros',
  'Conservas del Sur',
  'Sabor Tradicional',
  'Productos Frescos',
  'Panadería Artesanal',
  'Embutidos Ibéricos',
  'Postres deliciosos',
  'Frutos Secos',
  'Especias y Hierbas',
];

const PRODUCTOS: string[] = [
  'Cerveza',
  'Vino',
  'Aceite de oliva',
  'Queso',
  'Embutidos',
  'Frutas',
  'Verduras',
  'Pan',
  'Bebidas refrescantes',
  'Helado',
  'Chocolate',
  'Café',
  'Cereales',
  'Miel',
  'Frutos secos',
  'Especias',
];

const FAMILIAS: string[] = [
  'Bebidas',
  'Alimentos frescos',
  'Lácteos',
  'Panadería',
  'Charcutería',
  'Dulces',
  'Condimentos',
];

const SUBFAMILIAS: string[] = [
  'Bebidas alcohólicas',
  'Bebidas no alcohólicas',
  'Frutas frescas',
  'Verduras frescas',
  'Quesos',
  'Embutidos',
  'Pan blanco',
  'Pan integral',
  'Galletas',
  'Chocolate',
  'Café molido',
  'Café en grano',
  'Cereales de desayuno',
  'Mermeladas',
  'Frutos secos tostados',
  'Especias en polvo',
];

const PROPUESTA: string[] = [
  'Mejorar el descuento',
  'Mejorar la calidad',
];

const RECHAZOS: string[] = ['Rechazado', 'En Proceso', 'Vendido', 'No aplica'];

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['select', 'estado', 'id', 'poblacion', 'provincia', 'cliente', 'producto', 'familia', 'subfamilia', 'rechazo', 'pvp', 'comp', 'competidor', 'accionPrecioPorcentaje', 'accionCorrectora', 'propuestaAgente'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  rechazadosCount: number = 0;
  enProcesoCount: number = 0;
  vendidosCount: number = 0;
  noAplicaCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);

    this.form = this.formBuilder.group({
      EstadoFilterControl: [''],
      PoblacionFilterControl: [''],
      ProvinciaFilterControl: [''],
      ClienteFilterControl: [''],
      ProductoFilterControl: [''],
      FamiliaFilterControl: [''],
      SubFamiliaFilterControl: ['']
    });

    this.form.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript() {
    if (!document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBcREBnuBayqza1v1W2JbUGJqB0W77mcjI`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  applyFilter() {
    const filterValues = this.form.value;
    this.dataSource.filterPredicate = (data: UserData, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (!searchTerms.EstadoFilterControl || data.estado.toLowerCase().indexOf(searchTerms.EstadoFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.PoblacionFilterControl || data.poblacion.toLowerCase().indexOf(searchTerms.PoblacionFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.ProvinciaFilterControl || data.provincia.toLowerCase().indexOf(searchTerms.ProvinciaFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.ClienteFilterControl || data.cliente.toLowerCase().indexOf(searchTerms.ClienteFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.ProductoFilterControl || data.producto.toLowerCase().indexOf(searchTerms.ProductoFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.FamiliaFilterControl || data.familia.toLowerCase().indexOf(searchTerms.FamiliaFilterControl.toLowerCase()) !== -1) &&
             (!searchTerms.SubFamiliaFilterControl || data.subfamilia.toLowerCase().indexOf(searchTerms.SubFamiliaFilterControl.toLowerCase()) !== -1);
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  }

  filtroReset() {
    this.form.reset();
    this.dataSource.filter = '';
  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.data.forEach(row => {
        this.actualizarConteos(row.estado, true);
      });
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  verEnMapa() {
    if (this.selection.selected.length === 0) {
      const config = new MatSnackBarConfig();
      config.duration = 3000;
      config.verticalPosition = 'top';
      this.snackBar.open('Debe seleccionar al menos un cliente antes de ver en el mapa.', 'Cerrar', config);
      return;
    }

    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '1550px',
      height: 'auto',
      disableClose: true,
      data: { selectedRows: this.selection.selected }
    });
  }

  actualizarConteos(estado: string, incrementar: boolean) {
    switch (estado) {
      case 'Rechazado':
        this.rechazadosCount += incrementar ? 1 : -1;
        break;
      case 'En Proceso':
        this.enProcesoCount += incrementar ? 1 : -1;
        break;
      case 'Vendido':
        this.vendidosCount += incrementar ? 1 : -1;
        break;
      case 'No aplica':
        this.noAplicaCount += incrementar ? 1 : -1;
        break;
      default:
        break;
    }
  }

  getOptionImage(estado: string): string {
    // Ruta base de las imágenes en la carpeta 'src/assets/icon/'
    const basePath = 'assets/icon/';

    // Construir la URL de la imagen basada en el estado proporcionado
    switch (estado) {
      case 'Rechazado':
        return basePath + 'rechazado.svg';
      case 'En Proceso':
        return basePath + 'en_proceso.svg';
      case 'Vendido':
        return basePath + 'vendido.svg';
      case 'No aplica':
        return basePath + 'no_aplica.svg';
      default:
        return ''; // Devuelve una cadena vacía si el estado no coincide con ninguno de los casos anteriores
    }
  }

  onSave(row: UserData) {
    // Lógica para guardar el valor editado
    console.log('Valor guardado:', row.accionPrecioPorcentaje);
  }

  onSymbolChange(row: UserData) {
    // Lógica para manejar el cambio de símbolo
    console.log('Símbolo cambiado a:', row.symbol);
  }
}

function createNewUser(id: number): UserData {
  const poblacion = POBLACIONES[Math.floor(Math.random() * POBLACIONES.length)];
  const provincia = PROVINCIAS[Math.floor(Math.random() * PROVINCIAS.length)];
  const cliente = CLIENTES[Math.floor(Math.random() * CLIENTES.length)];
  const producto = PRODUCTOS[Math.floor(Math.random() * PRODUCTOS.length)];
  const familia = FAMILIAS[Math.floor(Math.random() * FAMILIAS.length)];
  const subfamilia = SUBFAMILIAS[Math.floor(Math.random() * SUBFAMILIAS.length)];
  const rechazo = RECHAZO[Math.floor(Math.random() * RECHAZO.length)];
  const pvp = Math.floor(Math.random() * 100);
  const comp = Math.floor(Math.random() * 100);
  const competidor = COMPETIDOR[Math.floor(Math.random() * COMPETIDOR.length)];
  const accionPrecioPorcentaje = Math.floor(Math.random() * 100);
  const accionCorrectora = ACCIONCORRECTORA[Math.floor(Math.random() * ACCIONCORRECTORA.length)];
  const propuestaAgente = PROPUESTA[Math.floor(Math.random() * PROPUESTA.length)];
  
// Definición del área de Madrid
const madridArea = {
  latMin: 40.312, // Límite sur de Madrid
  latMax: 40.642, // Límite norte de Madrid
  lonMin: -3.889, // Límite oeste de Madrid
  lonMax: -3.517  // Límite este de Madrid
};

// Función para generar coordenadas aleatorias dentro del área de Madrid
function getRandomCoordinatesInMadrid() {
  const latitud = Math.random() * (madridArea.latMax - madridArea.latMin) + madridArea.latMin;
  const longitud = Math.random() * (madridArea.lonMax - madridArea.lonMin) + madridArea.lonMin;
  return { latitud, longitud };
}

const { latitud, longitud } = getRandomCoordinatesInMadrid();

console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);


  return {
    id: id.toString(),
    estado: RECHAZOS[Math.floor(Math.random() * RECHAZOS.length)],
    poblacion: poblacion,
    provincia: provincia,
    cliente: cliente,
    producto: producto,
    familia: familia,
    subfamilia: subfamilia,
    rechazo: rechazo,
    pvp: pvp,
    comp: comp,
    competidor: competidor,
    accionPrecioPorcentaje: accionPrecioPorcentaje,
    accionCorrectora: accionCorrectora,
    latitud: latitud,
    longitud: longitud,
    propuestaAgente: propuestaAgente,
    symbol: '%',
  };
}
