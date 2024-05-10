import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { PopupFilterComponent } from './popup-filter/popup-filter.component';
import { MatDialog } from '@angular/material/dialog';


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
}

const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

const RECHAZOS: string[] = ['Rechazado', 'En Proceso', 'Vendido', 'No aplica'];

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit {
  displayedColumns: string[] = ['select','estado', 'id' , 'poblacion', 'provincia', 'cliente', 'producto', 'familia', 'subfamilia', 'rechazo', 'pvp', 'comp', 'competidor', 'accionCorrectora'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  rechazadosCount: number = 0;
  enProcesoCount: number = 0;
  vendidosCount: number = 0;
  noAplicaCount: number = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);
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
  

  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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
      width: '1080px',
      height: 'auto',
      disableClose: true,
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

  verFiltros() {
    const dialogRef = this.dialog.open(PopupFilterComponent, {
      width: '1080px',
      height: 'auto',
      disableClose: true,
    });
  }

}

function createNewUser(id: number): UserData {
  const poblacion = NAMES[Math.floor(Math.random() * NAMES.length)];
  const provincia = NAMES[Math.floor(Math.random() * NAMES.length)];
  const cliente = NAMES[Math.floor(Math.random() * NAMES.length)];
  const producto = NAMES[Math.floor(Math.random() * NAMES.length)];
  const familia = NAMES[Math.floor(Math.random() * NAMES.length)];
  const subfamilia = NAMES[Math.floor(Math.random() * NAMES.length)];
  const rechazo = RECHAZOS[Math.floor(Math.random() * RECHAZOS.length)];
  const pvp = Math.floor(Math.random() * 100).toString();
  const comp = Math.floor(Math.random() * 100).toString();
  const competidor = NAMES[Math.floor(Math.random() * NAMES.length)];
  const accionCorrectora = NAMES[Math.floor(Math.random() * NAMES.length)];

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
    accionCorrectora: accionCorrectora
  };
}
