import { AfterViewInit, Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
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
import { ISimbolo } from 'src/app/models/simbolos.model';

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit, OnInit {
  form: FormGroup;
  displayedColumns: string[] = ['select', 'estado', 'rechazo_id', 'poblacion', 'provincia', 'cliente', 'producto', 'nombre_familia', 'nombre_subfamilia', 'tipo_rechazo', 'precio_producto', 'precio_competidor', 'competidor','pvp_es_promocion_precio', 'accion_correctora', 'propuesta_agente'];
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
  simbolos: ISimbolo[]= [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    public dialog: MatDialog, 
    private formBuilder: FormBuilder, 
    private snackBar: MatSnackBar, 
    private cdr: ChangeDetectorRef, 
    private rechazadosService: RechazadosService,
    private filterService: FilterService,
    private paginatorIntl: MatPaginatorIntl
  ) {

    this.configurePaginatorLabels();
    
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
    this.loadSimbolos();
    this.loadGoogleMapsScript();
  }

  /* pagiantor */
  private configurePaginatorLabels() {
    this.paginatorIntl.itemsPerPageLabel = 'Rechazos por página';
    this.paginatorIntl.nextPageLabel = 'Página siguiente';
    this.paginatorIntl.previousPageLabel = 'Página anterior';
    this.paginatorIntl.firstPageLabel = 'Primera página';
    this.paginatorIntl.lastPageLabel = 'Última página';
    this.paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginatorIntl.changes.next(); // Esto notifica a Angular Material de los cambios
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

  private loadSimbolos(){
    this.filterService.getSimbolos().subscribe((simbolos: ISimbolo[]) =>{
      this.simbolos= simbolos;
      console.log('Cargando simbolos: ', simbolos);
    })
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
    this.dataSource.filterPredicate = (data: IRechazo, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (
        (!searchTerms.EstadoFilterControl || data.estado.toLowerCase().indexOf(searchTerms.EstadoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.PoblacionFilterControl || data.poblacion.toLowerCase().indexOf(searchTerms.PoblacionFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProvinciaFilterControl || data.provincia.toLowerCase().indexOf(searchTerms.ProvinciaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.ProductoFilterControl || data.producto.toLowerCase().indexOf(searchTerms.ProductoFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.FamiliaFilterControl || data.nombre_familia.toLowerCase().indexOf(searchTerms.FamiliaFilterControl.toLowerCase()) !== -1) &&
        (!searchTerms.SubFamiliaFilterControl || data.nombre_subfamilia.toLowerCase().indexOf(searchTerms.SubFamiliaFilterControl.toLowerCase()) !== -1)
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
  ///metodo para obtener los simbolos
  getSimboloName(symbolId: number): string {
    const symbol = this.simbolos.find(s => s.id === symbolId);
    return symbol ? symbol.simbolo : '';
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

  ///funcion para axtualizar estado
  actualizarEstados(row: IRechazo){
    const estadoSeleccionado = this.estados.find(estado => estado.estado === row.estado);

    if (estadoSeleccionado) {
      const idEstadoSeleccionado = estadoSeleccionado.id;
      
      // Mostrar en consola el rechazo_id y el ID del estado seleccionado
      console.log('ID de Rechazo seleccionado:', row.rechazo_id);
      console.log('ID de Estado seleccionado:', idEstadoSeleccionado);

      // Llamar al servicio para actualizar el estado
      this.rechazadosService.actualizarEstados(row.rechazo_id, idEstadoSeleccionado)
        .subscribe(
          (response) => {
            console.log('Estado actualizado correctamente');
            location.reload();
          },
          (error) => {
            console.error('Error al actualizar el estado', error);
          }
        );
    } else {
      console.error('No se encontró el ID del estado seleccionado en el array estados');
    }
    
    
  }


  startEditing(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: number }, field: string) {
    if (field === 'accionCorrectora') {
      row.tempAccionCorrectora = row.accion_correctora;
      row.editingAccionCorrectora = true;
    } else if (field === 'precioPromocion') {
      row.tempPrecioPromocion = row.pvp_es_promocion_precio;
      row.tempSimboloPromocion = row.id_simbolo;
      row.editingPrecioPromocion = true;
    }
  }

  // Este método se llama cada vez que se escribe en el input
  updateCharCount(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: number }) {
  }

  ///metodo para confirmar la edicion
  confirmEdit(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: number }, field: string) {
    if (field === 'accionCorrectora') {
      const id_rechazo = row.rechazo_id;
      if (row.tempAccionCorrectora && row.tempAccionCorrectora.length <= 50) {
        row.accion_correctora = row.tempAccionCorrectora || '';
        row.editingAccionCorrectora = false;
        const accion_correctora = row.tempAccionCorrectora;
        console.log('Enviando datos a actualizarAccionCorrectora:', {
          id_rechazo: row.rechazo_id,
          accion_correctora: accion_correctora,
        });
        // Aquí podrías llamar a la función de guardado si lo deseas
        this.rechazadosService.actualizarAccionCorrectora(id_rechazo, accion_correctora).subscribe(
          (response) => {
            // Actualización exitosa, manejar respuesta si es necesario
            this.snackBar.open('Acción correctora actualizada correctamente.', '', { duration: 3000, verticalPosition: 'top' });
            row.editingPrecioPromocion = false;
          },
          (error) => {
            // Error al actualizar, mostrar mensaje de error
            this.snackBar.open('Error al actualizar la acción correctora.', '', { duration: 3000, verticalPosition: 'top' });
            console.error('Error al actualizar la acción correctora:', error);
          }
        );
      } else {
        this.snackBar.open('La acción correctora debe tener entre 1 y 50 caracteres.', '', { duration: 3000, verticalPosition: 'top' });
      }
    } else if (field === 'precioPromocion') {
      if (row.tempPrecioPromocion != null && !isNaN(row.tempPrecioPromocion) && row.tempSimboloPromocion) {
        // Realizar la actualización solo si el precio y el símbolo de promoción son válidos
        row.pvp_es_promocion_precio = row.tempPrecioPromocion;
        row.id_simbolo = row.tempSimboloPromocion;
        console.log('Enviando datos a actualizarPrecioSimboloPromocion:', {
          rechazo_id: row.rechazo_id,
          tempPrecioPromocion: row.tempPrecioPromocion,
          tempSimboloPromocion: row.tempSimboloPromocion,
        });
        this.rechazadosService.actualizarPrecioSimboloPromocion(row.rechazo_id,  row.tempPrecioPromocion, row.tempSimboloPromocion,).subscribe(
          (response) => {
            // Actualización exitosa, manejar respuesta si es necesario
            location.reload();
            this.snackBar.open('Precio y símbolo de promoción actualizados correctamente.', '', { duration: 3000, verticalPosition: 'top' });
          },
          (error) => {
            // Error al actualizar, mostrar mensaje de error
            this.snackBar.open('Error al actualizar el precio y el símbolo de promoción.', '', { duration: 3000, verticalPosition: 'top' });
            console.error('Error al actualizar el precio y el símbolo de promoción:', error);
          }
        );
      } else {
        // Mostrar mensaje de error si el precio o el símbolo de promoción son inválidos
        this.snackBar.open('El precio y el símbolo de promoción son obligatorios.', '', { duration: 3000, verticalPosition: 'top' });
      }
    } else {
      // Manejar otros tipos de edición aquí si es necesario
    }
  }
  
  //metodo para cambiar el simbolo
  onSymbolChange(row: any) {
    console.log("Simbolo seleccionado:", row.pvp_es_promocion_symbol);
  }
  
  cancelEdit(row: IRechazo & { editingAccionCorrectora?: boolean; tempAccionCorrectora?: string; editingPrecioPromocion?: boolean; tempPrecioPromocion?: number; tempSimboloPromocion?: number }, field: string) {
    if (field === 'accionCorrectora') {
      row.editingAccionCorrectora = false;
    } else if (field === 'precioPromocion') {
      if (row.tempPrecioPromocion != null && !isNaN(row.tempPrecioPromocion)) {
        row.pvp_es_promocion_precio = row.tempPrecioPromocion;
      }
      if (row.tempSimboloPromocion) {
        row.id_simbolo = row.tempSimboloPromocion;
      }
      row.editingPrecioPromocion = false;
    }
  }

}
