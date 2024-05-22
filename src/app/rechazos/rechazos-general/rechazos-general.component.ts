import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { MatDialog } from '@angular/material/dialog';
import {MatSidenavModule} from '@angular/material/sidenav';
import { FormBuilder, FormGroup } from '@angular/forms';


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
  pvp: string;
  comp: string;
  competidor: string;
  accionCorrectora: string;
  latitud: number; // Nuevo campo para la latitud
  longitud: number; // Nuevo campo para la longitud

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

const RECHAZOS: string[] = ['Rechazado', 'En Proceso', 'Vendido', 'No aplica'];



@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit {
  form: FormGroup;
  displayedColumns: string[] = ['select','estado', 'id' , 'poblacion', 'provincia', 'cliente', 'producto', 'familia', 'subfamilia', 'rechazo', 'pvp', 'comp', 'competidor', 'accionCorrectora'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);


  rechazadosCount: number = 0;
  enProcesoCount: number = 0;
  vendidosCount: number = 0;
  noAplicaCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);

    this.form = this.formBuilder.group({
      EstadoFilterControl: [''],
      PoblacionFilterControl: [''],
      ProvinciaFilterControl:[''],
      ClienteFilterControl: [''],
      ProductoFilterControl: [''],
      FamiliaFilterControl: [''],
      SubFamiliaFilterControl: ['']
    });  
  }
  /* Aplicar filtros */
  // Implementa el método applyFilter() para aplicar filtros
  applyFilter() {
    console.log('Filtros aplicados:', this.form.value);
  }
  // Implementa el método filtroReset() para restablecer los filtros
  filtroReset() {
    this.form.reset();
    this.form.get('DateFilterControl')?.setValue([]);

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
    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '1550px',
      height: 'auto',
      disableClose: true,
      data:{selectedRows: this.selection.selected}
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

}

function createNewUser(id: number): UserData {
  const poblacion = POBLACIONES[Math.floor(Math.random() * POBLACIONES.length)];
  const provincia = PROVINCIAS[Math.floor(Math.random() * PROVINCIAS.length)];
  const cliente = NAMES[Math.floor(Math.random() * NAMES.length)];
  const producto = PRODUCTOS[Math.floor(Math.random() * PRODUCTOS.length)];
  const familia = FAMILIAS[Math.floor(Math.random() * FAMILIAS.length)];
  const subfamilia = SUBFAMILIAS[Math.floor(Math.random() * SUBFAMILIAS.length)];
  const rechazo = RECHAZOS[Math.floor(Math.random() * RECHAZOS.length)];
  const pvp = Math.floor(Math.random() * 100).toString();
  const comp = Math.floor(Math.random() * 100).toString();
  const competidor = NAMES[Math.floor(Math.random() * NAMES.length)];
  const accionCorrectora = NAMES[Math.floor(Math.random() * NAMES.length)];
  
  // Generación de coordenadas aleatorias dentro de Asturias
  const latitud = Math.random() * (43.5 - 42.5) + 42.5; // Latitud aproximada de Asturias
  const longitud = Math.random() * (-4.0 - (-6.0)) + (-6.0); // Longitud aproximada de Asturias

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
    accionCorrectora: accionCorrectora,
    latitud: latitud,
    longitud: longitud
  };
}
