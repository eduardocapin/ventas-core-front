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
import { IRechazo } from 'src/app/models/rechazos.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';
import { IEstadosRechazoCount } from 'src/app/models/count.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { IEstado } from 'src/app/models/estados.model';

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['select', 'estado', 'id', 'poblacion', 'provincia', 'cliente', 'producto', 'familia', 'subfamilia', 'rechazo', 'pvp', 'comp', 'competidor','accionPrecioSymbol', 'accionCorrectora', 'propuestaAgente'];
  dataSource: MatTableDataSource<IRechazo>;
  rechazoList: IRechazo[] = [];
  selection = new SelectionModel<IRechazo>(true, []);
  estadosRechazoCount: IEstadosRechazoCount = {
    cantidad_rechazo: 0,
    cantidad_noAplica: 0,
    cantidad_aceptado: 0,
    cantidad_enProceso: 0
  };
  estados: IEstado[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    public dialog: MatDialog, 
    private formBuilder: FormBuilder, 
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef, 
    private rechazadosService: RechazadosService,
    private filterService: FilterService
  ) {
    this.dataSource = new MatTableDataSource<IRechazo>([]);

    this.form = this.formBuilder.group({
      EstadoFilterControl: [''],
      PoblacionFilterControl: [''],
      ProvinciaFilterControl: [''],
      ProductoFilterControl: [''],
      FamiliaFilterControl: [''],
      SubFamiliaFilterControl: ['']
    });

    this.form.valueChanges.subscribe(() => {
      /* this.applyFilter(); */
    });
  }

  ngOnInit() {
    this.loadRechazos();
    this.loadEstadosRechazos();
    this.loadEstados();
    this.loadGoogleMapsScript();
  }

  private loadRechazos() {
    this.rechazadosService.getRechazos().subscribe((rechazos: IRechazo[]) => {
        this.rechazoList = rechazos;
        this.dataSource.data = rechazos;
        console.log('Rechazos cargados:', rechazos); // Mostrar los resultados en la consola
      });
  }
  private loadEstadosRechazos() {
    this.rechazadosService.countEstadosRechazos().subscribe((contadores: IEstadosRechazoCount[]) => {
      this.estadosRechazoCount = contadores[0];
      console.log('Contadores de estados de rechazos:', contadores); // Mostrar los contadores en la consola
    });
  }

  private loadEstados() {
    this.filterService.getEstados().subscribe((estados: IEstado[]) => {
      this.estados = estados;
      console.log('Estados cargados:', estados); // Mostrar los estados en la consola
    });
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
  


  /* applyFilter() {
    const filterValues = this.form.value;
    this.dataSource.filterPredicate = (data: IRechazo, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (
        (!searchTerms.EstadoFilterControl || data.estados.toLowerCase().indexOf(searchTerms.EstadoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.PoblacionFilterControl || data.poblacion.toLowerCase().indexOf(searchTerms.PoblacionFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProvinciaFilterControl || data.provincia.toLowerCase().indexOf(searchTerms.ProvinciaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProductoFilterControl || data.producto.toLowerCase().indexOf(searchTerms.ProductoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.FamiliaFilterControl || data.segmentacion_familia.toLowerCase().indexOf(searchTerms.FamiliaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.SubFamiliaFilterControl || data.segmentacion_subfamilia.toLowerCase().indexOf(searchTerms.SubFamiliaFilterControl.toLowerCase()) !== -1)
      );
    };
    this.dataSource.filter = JSON.stringify(filterValues);
  } */

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

  getOptionImage(estado: string): string {
    const basePath = 'assets/icon/';
  
    switch (estado) {
      case 'Rechazado':
        return `${basePath}rechazado.svg`;
      case 'En Proceso':
        return `${basePath}en_proceso.svg`;
      case 'Vendido':
        return `${basePath}vendido.svg`;
      case 'No aplica':
        return `${basePath}no_aplica.svg`;
      default:
        return ''; // Devuelve una cadena vacía si el estado no coincide con ninguno de los casos anteriores
    }
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

  startEditing(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: boolean }, field: string) {
    if (field === 'accionCorrectora') {
      row.tempAccionCorrectora = row.accion_correcta;
      row.editingAccionCorrectora = true;
    } else if (field === 'precioPromocion') {
      row.tempPrecioPromocion = row.pvp_es_competencia_precio;
      row.tempSimboloPromocion = row.pvp_es_competencia_symbol;
      row.editingPrecioPromocion = true;
    }
  }

  updateCharCount(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: boolean }) {
    // Este método se llama cada vez que se escribe en el input
  }

  confirmEdit(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: boolean }, field: string) {
    if (field === 'accionCorrectora') {
      if (row.tempAccionCorrectora && row.tempAccionCorrectora.length <= 50) {
        row.accion_correcta = row.tempAccionCorrectora || '';
        row.editingAccionCorrectora = false;
        // Aquí llamaría a la función de guardado, pero no lo haremos ahora
        // this.onSave(row);
      } else {
        this.snackBar.open('La acción correctora debe tener entre 1 y 50 caracteres.', '', { duration: 3000, verticalPosition: 'top' });
      }
    } else if (field === 'precioPromocion') {
      row.pvp_es_competencia_precio = row.tempPrecioPromocion || 0;
      row.pvp_es_competencia_symbol = row.tempSimboloPromocion || true;
      row.editingPrecioPromocion = false;
      // Aquí llamaría a la función de guardado, pero no lo haremos ahora
      // this.onSave(row);
    }
  }

  cancelEdit(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: boolean }, field: string) {
    if (field === 'accionCorrectora') {
      row.editingAccionCorrectora = false;
    } else if (field === 'precioPromocion') {
      row.editingPrecioPromocion = false;
    }
  }

  onSymbolChange(row: IRechazo & { tempSimboloPromocion?: boolean }) {
    this.snackBar.open('Símbolo cambiado a ' + (row.tempSimboloPromocion ? '€' : '%'), '', {
      duration: 3000,
      verticalPosition: 'top'
    });
    this.cdr.detectChanges(); // Forzar la detección de cambios después de cambiar el símbolo
  }

}
