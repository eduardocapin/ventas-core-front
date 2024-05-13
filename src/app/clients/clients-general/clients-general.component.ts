import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';

export interface UserData {
  codigo: string;
  poblacion: string;
  provincia: string;
  cp: string;
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



const POSTAL_CODES: string[] = [
  '33001', '33002', '33003', '33004', '33005', '33006', '33007', '33008', '33009', '33010',
  '33011', '33012', '33013', '33014', '33015', '33016', '33017', '33018', '33019', '33020',
  '33021', '33022', '33023', '33024', '33025', '33026', '33027', '33028', '33029', '33030'
];


@Component({
  selector: 'app-clients-general',
  templateUrl: './clients-general.component.html',
  styleUrls: ['./clients-general.component.css']
})
export class ClientsGeneralComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'codigo', 'provincia', 'poblacion', 'cp'];
  dataSource: MatTableDataSource<UserData>;
  selection = new SelectionModel<UserData>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
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
}

function createNewUser(codigo: number): UserData {
  const poblacion = POBLACIONES[Math.floor(Math.random() * POBLACIONES.length)];
  const provincia = PROVINCIAS[Math.floor(Math.random() * PROVINCIAS.length)];
  const cp = POSTAL_CODES[Math.floor(Math.random() * POSTAL_CODES.length)];


  return {
    codigo: codigo.toString(),
    poblacion: poblacion,
    provincia: provincia,
    cp: cp,
  };
}
