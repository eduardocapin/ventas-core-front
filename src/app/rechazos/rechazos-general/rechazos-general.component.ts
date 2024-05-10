import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupMapComponent } from './popup-map/popup-map.component';
import { MatDialog } from '@angular/material/dialog';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
  estado: string;
}

// Constants used to fill up our data base.
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
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

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit {
  displayedColumns: string[] = ['select', 'id', 'estado', 'name', 'progress', 'fruit'];
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
    if (this.dataSource) {
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
      disableClose: false,
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
}

function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';
  
  const estadoOptions = ['Rechazado', 'En Proceso', 'Vendido', 'No aplica'];
  const randomEstadoIndex = Math.floor(Math.random() * estadoOptions.length);
  const estado = estadoOptions[randomEstadoIndex];

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
    estado: estado,
  };
}
