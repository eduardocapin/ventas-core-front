import {
  AfterViewInit,
  Component,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PopupMapComponent } from './popup-map-rechazos/popup-map-rechazos.component';
import { IRechazo } from 'src/app/models/rechazos.model';
import { RechazadosService } from 'src/app/services/rechazados/rechazados.service';

import { FilterService } from 'src/app/services/filter/filter.service';
import { IEstado } from 'src/app/models/estados.model';
import { ISimbolo } from 'src/app/models/simbolos.model';
import { ITipo_Rechazo } from 'src/app/models/tipos_rechazos.model';
import { ExportService } from 'src/app/services/export/export.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { PopupClientDetailComponent } from 'src/app/clients/clients-general/popup-client-detail/popup-client-detail.component';
import { ICompetidor } from 'src/app/models/competidor.model';
;
import { IMotivoRechazo } from 'src/app/models/motivoRechazo.model';

@Component({
  selector: 'app-rechazos-general',
  templateUrl: './rechazos-general.component.html',
  styleUrls: ['./rechazos-general.component.css'],
})
export class RechazosGeneralComponent implements AfterViewInit, OnInit {

  form: FormGroup;
  displayedColumns: string[] = [
    'select',
    'estado',
    'poblacion',
    'cliente',
    'nombre_subfamilia',
    'producto',
    'tipo_rechazo',
    'precio_producto',
    'promo_propia',
    'precio_competidor',
    'promo_competidor',
    'competidor',
    'accion_correctora',
    'propuesta_agente',
    'interes',
    'expand',
  ];
  dataSource: IRechazo[] = []; // Temporarily set to any[]
  rechazoList: IRechazo[] = [];
  selection = new SelectionModel<IRechazo>(true, []);
  estados: IEstado[] = [];
  competidores: ICompetidor[] = [];
  motivos_rechazo: IMotivoRechazo[] = [];
  simbolos: ISimbolo[] = [];
  expandedElement?: IRechazo | null;

  selectedOption: string = 'Excel';

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private rechazadosService: RechazadosService,
    private filterService: FilterService,
    private _exportService: ExportService,
    private toastr: ToastrService
  ) {
    this.form = this.formBuilder.group({
      EstadoFilterControl: [''],
      PoblacionFilterControl: [''],
      ProvinciaFilterControl: [''],
      ProductoFilterControl: [''],
      FamiliaFilterControl: [''],
      SubFamiliaFilterControl: [''],
    });

    this.form.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  ngOnInit() {
    this.loadRechazos();
    this.loadEstadosRechazos();
    this.loadEstados();
    this.loadSimbolos();
    this.loadGoogleMapsScript();
    this.loadCompetidores();
    this.loadTiposRechazo();
  }

  private loadRechazos() {
    this.rechazadosService.getRechazos().subscribe((rechazos: IRechazo[]) => {
      console.log('Rechazos cargados:', rechazos);
      this.dataSource = rechazos;
      this.rechazoList = rechazos;
    });
  }

  private loadEstadosRechazos() { }

  private loadEstados() {
    this.filterService.getEstados().subscribe((estados: IEstado[]) => {
      this.estados = estados;
    });
  }

  private loadCompetidores() {
    this.filterService
      .getCompetidores()
      .subscribe((competidores: ICompetidor[]) => {
        this.competidores = competidores;
      });
  }

  private loadTiposRechazo() {
    this.filterService
      .getMotivosRechazo()
      .subscribe((motivos_rechazo: IMotivoRechazo[]) => {
        this.motivos_rechazo = motivos_rechazo;
      });
  }

  private loadSimbolos() {
    this.filterService.getSimbolos().subscribe((simbolos: ISimbolo[]) => {
      console.log(simbolos);
      this.simbolos = simbolos;
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

  applyFilter() {
    const filterValues = this.form.value;
    this.dataSource = this.dataSource.filter(
      (data) =>
        (!filterValues.EstadoFilterControl ||
          data.status
            .toLowerCase()
            .includes(filterValues.EstadoFilterControl.toLowerCase())) &&
        (!filterValues.PoblacionFilterControl ||
          data.city
            .toLowerCase()
            .includes(filterValues.PoblacionFilterControl.toLowerCase())) &&
        (!filterValues.ProvinciaFilterControl ||
          data.province
            .toLowerCase()
            .includes(filterValues.ProvinciaFilterControl.toLowerCase())) &&
        (!filterValues.ProductoFilterControl ||
          data.product
            .toLowerCase()
            .includes(filterValues.ProductoFilterControl.toLowerCase())) &&
        (!filterValues.SubFamiliaFilterControl ||
          data.subfamily
            .toLowerCase()
            .includes(filterValues.SubFamiliaFilterControl.toLowerCase()))
    );
  }

  getMotivoRechazo(id: number): string {
    const rechazo = this.motivos_rechazo.find((c) => c.id == id);
    return rechazo ? rechazo.rejection : 'No encontrado';
  }

  getEstado(id: number): string {
    const estado = this.estados.find((c) => c.id == id);
    return estado ? estado.name : 'No encontrado';
  }

  filtroReset() {
    this.form.reset();
    this.applyFilter();
  }

  ngAfterViewInit() {
    // Placeholder for further initialization if needed
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  getOptionImage(statusId: number): string {
    return `assets/icon/estado_${statusId}.svg`;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.forEach((row) => this.selection.select(row));
  }

  getSimboloName(symbolId: number): string {
    const symbol = this.simbolos.find((s) => s.id === symbolId);
    return symbol ? symbol.symbol : '';
  }

  verEnMapa() {
    if (this.selection.selected.length === 0) {
      this.toastr.warning(
        'Debe seleccionar al menos 1 rechazo antes de ver en el mapa.',
        'Advertencia'
      );
      return;
    }

    const dialogRef = this.dialog.open(PopupMapComponent, {
      width: '80%',
      height: '80%',
      disableClose: true,
      data: { selectedRows: this.selection.selected },
    });
  }

  /* popup-rechazo-detail */
  viewRechazo(id_Cliente?: any) {
    const dialogRef = this.dialog.open(PopupClientDetailComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: id_Cliente },
    });
  }

  actualizarEstados(row: IRechazo) {
    console.log(row)
    const estadoSeleccionado = this.estados.find(
      (estado) => estado.id == row.status_id
    );

    if (estadoSeleccionado) {
      const idEstadoSeleccionado = estadoSeleccionado.id;
      console.log('ID de Rechazo seleccionado:', row.id);
      console.log('ID de Estado seleccionado:', idEstadoSeleccionado);
    } else {
      console.error(
        'No se encontró el ID del estado seleccionado en el array estados'
      );
    }
  }

  updateSymbol(row: IRechazo & { tempSimboloPromocion?: number }) {
    if (row.tempSimboloPromocion != null) {
      row.corrective_action_symbol_id = row.tempSimboloPromocion;
      console.log('Símbolo actualizado:', row.corrective_action_symbol_id);

      this.rechazadosService
        .actualizarPrecioSimboloPromocion(
          row.id,
          row.tempSimboloPromocion,
          row.tempSimboloPromocion
        )
        .subscribe(
          (response) => {
            this.toastr.success('Símbolo actualizado correctamente.', '', {});
          },
          (error) => {
            this.toastr.error('Error al actualizar el símbolo.', '', {});
            console.error('Error al actualizar el símbolo:', error);
          }
        );
    }
  }

  exportar_rechazos() {
    if (this.selection.isEmpty()) {
      return;
    }
    if (this.selectedOption == '') {
      return;
    }
    this.exportarIds();
  }

  exportarIds() {
    const idsSeleccionados = this.selection.selected.map((row) => row.id);
    this.exportData(this.rechazoList);
  }

  exportData(data: any[]): void {
    console.log('en funcion ', data);
    console.log('en funcion', this.selectedOption);
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace(/[-T:]/g, '-');

    const fileName = `exportacion_pedidos_${timestamp}`;

    if (this.selectedOption === 'Excel') {
      this._exportService.exportToExcel(data, fileName);
    } else if (this.selectedOption === 'CSV') {
      this._exportService.exportToCSV(data, fileName);
    } else if (this.selectedOption === 'Json') {
      this._exportService.exportToJson(data, fileName);
    }
  }

  updateOption(option: string) {
    this.selectedOption = option;
  }

  /* sort que ayudara a filtrar */
  sortDirection: string = 'asc';
  currentSortColumn: string = '';
  sortData(column: string) {
    const isAsc = this.currentSortColumn === column && this.sortDirection === 'asc';

    // Ordenar la fuente de datos dependiendo del tipo de dato
    this.dataSource.sort((a, b) => {
      const compareA = a[this.currentSortColumn as keyof IRechazo];
      const compareB = b[this.currentSortColumn as keyof IRechazo];

      // Verificar si los valores son de tipo cadena (string)
      if (typeof compareA === 'string' && typeof compareB === 'string') {
        return compareA.localeCompare(compareB) * (isAsc ? 1 : -1);
      }

      // Si son números, simplemente restar
      if (typeof compareA === 'number' && typeof compareB === 'number') {
        return (compareA - compareB) * (isAsc ? 1 : -1);
      }

      // Agregar soporte para otras comparaciones según sea necesario
      return 0;
    });

    // Actualizar la columna actual y alternar la dirección
    this.currentSortColumn = column;
    this.sortDirection = isAsc ? 'desc' : 'asc';
  }

  changeMotivo(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newReasonId = Number(selectElement.value);
      const newReasonName = this.motivos_rechazo.find(rechazo => rechazo.id === newReasonId);

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].reason_rejection_id = newReasonId;
      this.dataSource[dataSourceIndex].reason_rejection = newReasonName?.rejection ?? "No encontrado";
    }
  }

  changeEstado(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newStatusId = Number(selectElement.value);
      const newStatusName = this.estados.find(estado => estado.id === newStatusId);

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].status_id = newStatusId;
      this.dataSource[dataSourceIndex].status = newStatusName?.name ?? "No encontrado";
    }
  }

  changeCompetidor(event: Event, row: IRechazo) {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement) {
      const newCompetidorId = Number(selectElement.value);
      const newCompetidorName = this.competidores.find(competidor => competidor.id === newCompetidorId);

      const dataSourceIndex = this.dataSource.indexOf(row);

      this.dataSource[dataSourceIndex].competitor_id = newCompetidorId;
      this.dataSource[dataSourceIndex].competitor_name = newCompetidorName?.name ?? "No encontrado";
    }
  }
}
