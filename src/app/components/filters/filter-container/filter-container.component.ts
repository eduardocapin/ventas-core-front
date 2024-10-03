import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MultiSelectFilterComponent } from '../multi-select-filter/multi-select-filter.component';
import { FilterService } from 'src/app/services/filter/filter.service';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { DateFilterComponent } from '../date-filter/date-filter.component';
import { RangeFilterComponent } from '../range-filter/range-filter.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
declare const bootstrap: any;
@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss'],
})
export class FilterContainerComponent implements OnInit {
  @Input() componentId: string = '';
  @Output() filtersChanged = new EventEmitter<{ [key: string]: any }>();

  filters: any[] = [];
  @Input() selectedFilters: { [key: string]: any } = {};
  filtrosAplicados: { id: string; nombre: string; valor: any; tipo: string }[] =
    [];
  filtrosGuardados: { id: number; nombre: string; filtros: any[] }[] = [];
  mostrarInputNombre: boolean = false;
  nombreFiltroGuardado: string = '';

  @ViewChildren(MultiSelectFilterComponent)
  multiSelectComponents?: QueryList<MultiSelectFilterComponent>;
  @ViewChildren(SearchFilterComponent)
  searchComponents?: QueryList<SearchFilterComponent>;
  @ViewChildren(DateFilterComponent)
  dateComponents?: QueryList<DateFilterComponent>;
  @ViewChildren(RangeFilterComponent)
  rangeComponents?: QueryList<RangeFilterComponent>;

  private hijosCargados: boolean = false;

  constructor(private filterService: FilterService, public dialog: MatDialog) {}

  ngOnInit() {
    this.filterService.getFiltersForComponent(this.componentId).subscribe(
      (response) => {
        this.filters = response;
      },
      (error) => {
        console.error('Error al cargar los filtros:', error);
      }
    );
    this.cargarFiltrosGuardados();
  }

  ngAfterViewInit() {
    if (Object.keys(this.selectedFilters).length > 0) {
      this.aplicarFiltrosSeleccionados();
    }
    this.multiSelectComponents?.changes.subscribe(() =>
      this.verificarCargaDeHijos()
    );
    this.searchComponents?.changes.subscribe(() =>
      this.verificarCargaDeHijos()
    );
    this.dateComponents?.changes.subscribe(() => this.verificarCargaDeHijos());
    this.rangeComponents?.changes.subscribe(() => this.verificarCargaDeHijos());
  }
  ngAfterViewChecked() {
    // Verificar si los hijos ya están cargados
    if (!this.hijosCargados) {
      this.verificarCargaDeHijos();
    }
  }
  verificarCargaDeHijos() {
    // Comprobar si todos los componentes hijos están presentes y listos
    const todosCargados =
      this.multiSelectComponents?.toArray().length ===
        this.filters.filter((f) => f.type === 'multi-select').length &&
      this.searchComponents?.toArray().length ===
        this.filters.filter((f) => f.type === 'search').length &&
      this.dateComponents?.toArray().length ===
        this.filters.filter((f) => f.type === 'date').length &&
      this.rangeComponents?.toArray().length ===
        this.filters.filter((f) => f.type === 'range').length;

    if (todosCargados) {
      this.hijosCargados = true;
      this.actualizarComponentesHijos();
    }
  }

  aplicarFiltrosSeleccionados() {
    this.filtrosAplicados = JSON.parse(JSON.stringify(this.selectedFilters));
    this.selectedFilters = this.filtrosAplicados.reduce(
      (acc: { [key: string]: any }, filtro) => {
        acc[filtro.id] = filtro.valor;
        return acc;
      },
      {}
    );
    console.log(this.filtrosAplicados);
    console.log(this.selectedFilters);
    //this.actualizarComponentesHijos()
    //this.filtersChanged.emit(this.filtrosAplicados);
  }

  cargarFiltrosGuardados() {
    this.filterService.getSavedFilters(this.componentId).subscribe(
      (response) => {
        this.filtrosGuardados = response;
        console.log(this.filtrosGuardados);
      },
      (error) => {
        console.error('Error al cargar los filtros guardados:', error);
      }
    );
  }

  guardarFiltros() {
    if (this.nombreFiltroGuardado) {
      this.filterService
        .saveFilter(
          this.componentId,
          this.nombreFiltroGuardado,
          this.filtrosAplicados
        )
        .subscribe((filtroGuardado) => {
          console.log(filtroGuardado);
          if (filtroGuardado.status == 'Success') {
            this.filtrosGuardados.push({
              id: filtroGuardado.data.insertId,
              nombre: this.nombreFiltroGuardado.trim(),
              filtros: [...this.filtrosAplicados],
            });
            this.nombreFiltroGuardado = '';
          }
        });
    }
  }

  eliminarFiltroGuardado(filtroGuardado: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `¿Estas seguro de eliminar este filtro?`,
      })
      .afterClosed()
      .subscribe((confirmado: Boolean) => {
        if (confirmado) {
          this.filterService.deleteFilter(filtroGuardado.id).subscribe(() => {
            // Actualiza la lista de filtros guardados después de eliminar
            this.filtrosGuardados = this.filtrosGuardados.filter(
              (filtro) => filtro.id !== filtroGuardado.id
            );
          });
        }
      });
  }

  handleFilterChange(filterId: string, value: any) {
    this.selectedFilters[filterId] = value;

    const existingFilter = this.filtrosAplicados.find(
      (filtro) => filtro.id === filterId
    );
    const filterInfo = this.filters.find((filter) => filter.id === filterId);

    if (existingFilter) {
      console.log('Filtro existente: ', existingFilter.valor);

      if (existingFilter.tipo === 'date' && value.startDate && value.endDate) {
        existingFilter.valor = {
          startDate: value.startDate,
          endDate: value.endDate,
        };
      } else if (existingFilter.valor.length > 0) {
        existingFilter.valor = value;
      } else {
        delete this.selectedFilters[existingFilter.id];
        this.filtrosAplicados = this.filtrosAplicados.filter(
          (filtro) => filtro.id !== existingFilter.id
        );
        this.resetChildFilter(existingFilter.id);
      }
    } else if (filterInfo) {
      /// si es un nuevo filtro
      let newFilterValue = value;
      //si es un filtro de tipo fecha, asegurarse de manejar el objeto con starDate y endDate
      if (filterInfo.type === 'date' && value.startDate && value.endDate) {
        newFilterValue = {
          startDate: value.starDate,
          endDate: value.endDate,
        };
      }

      this.filtrosAplicados.push({
        id: filterId,
        nombre: filterInfo.title,
        valor: value,
        tipo: filterInfo.type,
      });
    }
    this.filtersChanged.emit(this.filtrosAplicados);
  }

  mostrarInputParaGuardar() {
    const modal = new bootstrap.Modal(
      document.getElementById('nombreFiltroModal') as HTMLElement
    );
    modal.show();
  }

  cancelarGuardado() {
    this.nombreFiltroGuardado = ''; // Limpia el campo de entrada
  }

  // Seleccionar filtros guardados
  seleccionarFiltrosGuardados(filtroGuardado: any) {
    console.log(filtroGuardado);
    if (!filtroGuardado || !Array.isArray(filtroGuardado.filtros)) {
      console.error(
        'El filtro guardado no tiene la estructura esperada:',
        filtroGuardado
      );
      return;
    }
    this.filtrosAplicados = JSON.parse(JSON.stringify(filtroGuardado.filtros));
    this.selectedFilters = this.filtrosAplicados.reduce(
      (acc: { [key: string]: any }, filtro) => {
        acc[filtro.id] = filtro.valor;
        return acc;
      },
      {}
    );
    this.filtersChanged.emit(this.filtrosAplicados);
    this.actualizarComponentesHijos();
  }

  // Actualizar los componentes hijos con los filtros seleccionados
  actualizarComponentesHijos() {
    // Solo actualiza los filtros que tienen valores seleccionados
    console.log('sdsdsad');
    this.multiSelectComponents?.forEach((component) => {
      console.log('component');
      const selectedValue = this.selectedFilters[component.id];
      console.log(selectedValue);
      if (selectedValue && selectedValue.length > 0) {
        // Asegúrate de que el valor no esté vacío
        component.update(selectedValue);
      }
    });

    this.dateComponents?.forEach((component) => {
      const selectedValue = this.selectedFilters[component.id];
      if (selectedValue && selectedValue.startDate && selectedValue.endDate) {
        component.update(selectedValue);
      }
    });

    this.rangeComponents?.forEach((component) => {
      const selectedValue = this.selectedFilters[component.id];
      if (
        selectedValue &&
        selectedValue.min != null &&
        selectedValue.max != null
      ) {
        component.update(selectedValue);
      }
    });
  }

  // Eliminar un filtro aplicado
  removeFilter(filtroToRemove: any) {
    delete this.selectedFilters[filtroToRemove.id];
    this.filtrosAplicados = this.filtrosAplicados.filter(
      (filtro) => filtro.id !== filtroToRemove.id
    );
    this.filtersChanged.emit(this.filtrosAplicados);

    // Llamar a reset en el componente hijo si es un multi-select
    this.resetChildFilter(filtroToRemove.id);
  }

  filtroReset() {
    this.selectedFilters = {};
    this.filtrosAplicados = [];
    this.filtersChanged.emit(this.selectedFilters);

    this.multiSelectComponents?.forEach((component) => component.reset());
    this.dateComponents?.forEach((component) => component.reset());
    this.searchComponents?.forEach((component) => component.reset());
    this.rangeComponents?.forEach((component) => component.reset());
  }

  // Llamar a reset en el componente hijo específico
  resetChildFilter(filterId: string) {
    const childComponent = this.multiSelectComponents?.find(
      (comp) => comp.id === filterId
    );
    if (childComponent) {
      childComponent.reset();
    }
  }

  getMultiSelectDisplay(value: any[]): string {
    if (value && value.length) {
      return value.map((item) => item.name).join(', ');
    }
    return 'Vacío';
  }
  formatDateToDisplay(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  onClose() {
    const modalElement = document.getElementById('nombreFiltroModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
