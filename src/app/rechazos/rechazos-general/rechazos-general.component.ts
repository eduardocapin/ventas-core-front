import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupMapComponent } from './popup-map-rechazos/popup-map-rechazos.component';
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
  tempAccionCorrectora?: string;
  tempAccionPrecioPorcentaje?: number;
  editingAccionCorrectora?: boolean;
  editingAccionPrecioPorcentaje?: boolean;
  propuestaAgente: string;
  latitud: number;
  longitud: number;
  symbol: string;
  previousEstado?: string; // Almacenar el estado anterior
}

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

  estados = [
    { value: 'Rechazado', viewValue: 'Rechazado' },
    { value: 'En Proceso', viewValue: 'En Proceso' },
    { value: 'Vendido', viewValue: 'Vendido' },
    { value: 'No aplica', viewValue: 'No aplica' }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    const users = [
      this.createUser('1', 'Rechazado', 'Madrid', 'Madrid', 'Mercadona', 'Cerveza', 'Bebidas', 'Bebidas alcohólicas', 'Mal estado', 10, 8, 'Distribuciones Rico', 15, 'Promoción 2x1', 'Mejorar el descuento', 40.416775, -3.703790),
      this.createUser('2', 'En Proceso', 'Barcelona', 'Barcelona', 'Carrefour', 'Queso', 'Lácteos', 'Quesos', 'Mejor precio competencia', 20, 18, 'Cadea 100 Profesional', 10, 'Aplicar campaña trimestral', 'Mejorar la calidad', 41.385064, 2.173404),
      this.createUser('3', 'Vendido', 'Valencia', 'Valencia', 'Eroski', 'Aceite de oliva', 'Alimentos frescos', 'Frutas frescas', 'Producto no trabajado', 30, 28, 'Bazar Hogar', 5, 'Promoción 1+1', 'Mejorar el descuento', 39.469907, -0.376288),
      this.createUser('4', 'No aplica', 'Sevilla', 'Sevilla', 'Lidl', 'Pan', 'Panadería', 'Pan blanco', 'Mala calidad', 40, 38, 'Distribuciones Rico', 25, 'Promoción 3x2', 'Mejorar la calidad', 37.389092, -5.984459),
      this.createUser('5', 'Rechazado', 'Zaragoza', 'Zaragoza', 'Dia', 'Vino', 'Bebidas', 'Bebidas alcohólicas', 'Mal estado', 50, 48, 'Cadea 100 Profesional', 20, 'Regalo de cartelería de publicidad', 'Mejorar el descuento', 41.648823, -0.889085),
    ];

    this.dataSource = new MatTableDataSource(users);

    this.form = this.formBuilder.group({
      EstadoFilterControl: [''],
      PoblacionFilterControl: [''],
      ProvinciaFilterControl: [''],
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
      return (
        (!searchTerms.EstadoFilterControl || data.estado.toLowerCase().indexOf(searchTerms.EstadoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.PoblacionFilterControl || data.poblacion.toLowerCase().indexOf(searchTerms.PoblacionFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProvinciaFilterControl || data.provincia.toLowerCase().indexOf(searchTerms.ProvinciaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProductoFilterControl || data.producto.toLowerCase().indexOf(searchTerms.ProductoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.FamiliaFilterControl || data.familia.toLowerCase().indexOf(searchTerms.FamiliaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.SubFamiliaFilterControl || data.subfamilia.toLowerCase().indexOf(searchTerms.SubFamiliaFilterControl.toLowerCase()) !== -1)
      );
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
      this.cdr.detectChanges(); // Forzar la detección de cambios después de actualizar los conteos
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
      this.snackBar.open('Debe seleccionar al menos 1 rechazo antes de ver en el mapa.', '', config);
      return;
    }

    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '80%',
      height: '80%',
      disableClose: true,
      data: { selectedRows: this.selection.selected }
    });
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

  startEditing(row: UserData, field: string) {
    if (field === 'accionCorrectora') {
      row.editingAccionCorrectora = true;
      row.tempAccionCorrectora = row.accionCorrectora;
    } else if (field === 'accionPrecioPorcentaje') {
      row.editingAccionPrecioPorcentaje = true;
      row.tempAccionPrecioPorcentaje = row.accionPrecioPorcentaje;
    }
  }

  updateCharCount(row: UserData) {
    // Este método se llama cada vez que se escribe en el input
  }

  confirmEdit(row: UserData, field: string) {
    if (field === 'accionCorrectora') {
      if (row.tempAccionCorrectora && row.tempAccionCorrectora.length <= 50) {
        row.accionCorrectora = row.tempAccionCorrectora || '';
        row.editingAccionCorrectora = false;
        this.onSave(row);
      } else {
        this.snackBar.open('La acción correctora debe tener entre 1 y 50 caracteres.', '', { duration: 3000, verticalPosition: 'top' });
      }
    } else if (field === 'accionPrecioPorcentaje') {
      if (row.tempAccionPrecioPorcentaje !== undefined && row.tempAccionPrecioPorcentaje < 0) {
        this.snackBar.open('No se pueden introducir valores negativos.', '', { duration: 3000, verticalPosition: 'top' });
      } else {
        row.accionPrecioPorcentaje = row.tempAccionPrecioPorcentaje || 0;
        row.editingAccionPrecioPorcentaje = false;
        this.onSave(row);
      }
    }
  }

  cancelEdit(row: UserData, field: string) {
    if (field === 'accionCorrectora') {
      row.editingAccionCorrectora = false;
    } else if (field === 'accionPrecioPorcentaje') {
      row.editingAccionPrecioPorcentaje = false;
    }
  }

  onSave(row: UserData) {
    // Lógica para guardar el valor editado
    console.log('Valor guardado:', row.accionCorrectora);

    // Mostrar Snackbar de éxito
    const config = new MatSnackBarConfig();
    config.duration = 3000;  // Duración de la snackbar
    config.verticalPosition = 'top';

    this.snackBar.open('ACCIÓN CORRECTORA se ha actualizado correctamente', '', config);
    this.cdr.detectChanges(); // Forzar la detección de cambios después de guardar
  }

  onSymbolChange(row: UserData) {
    // Lógica para manejar el cambio de símbolo
    console.log('Símbolo cambiado a:', row.symbol);
    const config = new MatSnackBarConfig();
    config.duration = 3000;  // Duración de la snackbar
    config.verticalPosition = 'top';

    this.snackBar.open('Símbolo cambiado a ' + '[ ' + row.symbol + ' ]' + ' correctamente', '', config);
    this.cdr.detectChanges(); // Forzar la detección de cambios después de cambiar el símbolo
  }

  onEstadoChange(event: any, row: UserData) {
    const previousEstado = row.previousEstado || row.estado; // Utiliza el estado anterior almacenado o el actual si no hay uno anterior
    row.previousEstado = event.value;
    row.estado = event.value;

    // Mostrar mensaje de éxito
    this.snackBar.open('ESTADO se ha actualizado correctamente', '', {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

  createUser(id: string, estado: string, poblacion: string, provincia: string, cliente: string, producto: string, familia: string, subfamilia: string, rechazo: string, pvp: number, comp: number, competidor: string, accionPrecioPorcentaje: number, accionCorrectora: string, propuestaAgente: string, latitud: number, longitud: number): UserData {
    return {
      id: id,
      estado: estado,
      previousEstado: estado, // Almacenar el estado inicial como estado anterior
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
}
