import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { FilterService } from 'src/app/services/filter/filter.service';

@Component({
  selector: 'mobentis-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.scss'],
})
export class MultiSelectFilterComponent {
  @Input() title: string = 'Seleccionar';
  @Input() endpoint: string = '';
  @Input() id: string = '';
  @Output() selectionChange = new EventEmitter<any[]>();

  options: any[] = [];
  filteredOptions: any[] = [];
  displayedOptions: any[] = [];
  selectedOptions = new Map<number, any>();
  searchTerm: string = '';

  itemsPerPage = 50;
  currentPage = 1;
  loading = false;

  constructor(private _filterService: FilterService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['endpoint'] && changes['endpoint'].currentValue) {
      this.resetData();
      this.loadOptions(this.endpoint);
    }
  }

  private resetData() {
    this.options = [];
    this.filteredOptions = [];
    this.displayedOptions = [];
    this.currentPage = 1;
    this.selectedOptions.clear();
    this.searchTerm = '';
  }

  onDropdownOpen() {
    if (this.options.length === 0 && !this.loading) {
      this.loadOptions(this.endpoint);
    }
  }

  loadOptions(endpoint: string) {
    this.loading = true;
    this._filterService.getFilterOptions(endpoint).subscribe(
      (options) => {
        this.options = options;
        this.filteredOptions = [...options];
        this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
        this.restoreSelectedOptions();
        this.loading = false;
      },
      (error) => {
        console.error('Error al cargar las opciones:', error);
        this.loading = false;
      }
    );
  }

  onScroll(event: any) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const newItems = this.filteredOptions.slice(startIndex, startIndex + this.itemsPerPage);
    if (newItems.length > 0) {
      this.displayedOptions = [...this.displayedOptions, ...newItems];
      this.currentPage++;
    }
  }

  oninputChange() {
    if (this.searchTerm.length >= 3) {
      this.filteredOptions = this.options.filter(option => 
        option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
    this.currentPage = 1;
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
  }

  toggleSelection(option: any) {
    if (this.selectedOptions.has(option.id)) {
      this.selectedOptions.delete(option.id);
      option.selected = false;
    } else {
      this.selectedOptions.set(option.id, option);
      option.selected = true;
    }
    console.log( Array.from(this.selectedOptions.values()))
    this.selectionChange.emit(Array.from(this.selectedOptions.values()));
  }

  reset() {
    this.selectedOptions.clear();
    this.options.forEach((option) => (option.selected = false));
    this.filteredOptions = [...this.options];
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
    this.searchTerm = '';
  }

  update(filtroAplicado: { id: number; name: string; selected: boolean }[]) {
    if (this.options.length === 0) {
      this._filterService.getFilterOptions(this.endpoint).subscribe((options) => {
        this.options = options;
        this.filteredOptions = [...options];
        this.applyFilter(filtroAplicado, false); // No emitir evento al actualizar
      });
    } else {
      this.applyFilter(filtroAplicado, false); // No emitir evento al actualizar
    }
  }

  private applyFilter(filtroAplicado: { id: number; name: string; selected: boolean }[], emitChange: boolean = true) {
    const appliedIds = new Set(filtroAplicado.map((f) => f.id));
    let hasChanged = false;
  
    this.selectedOptions.clear();
    this.options.forEach((option) => {
      const wasSelected = option.selected;
      option.selected = appliedIds.has(option.id);
      if (option.selected) {
        this.selectedOptions.set(option.id, option);
      }
      if (wasSelected !== option.selected) {
        hasChanged = true;
      }
    });
  
    this.filteredOptions = [...this.options];
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
  
    // Solo emitir si se especifica o si hubo cambios
    if (emitChange && hasChanged) {
      console.log( Array.from(this.selectedOptions.values()))
      this.selectionChange.emit(  this.selectedOptions.size > 0? Array.from(this.selectedOptions.values()): []);
    }
  }

  private restoreSelectedOptions() {
    this.options.forEach((option) => {
      if (this.selectedOptions.has(option.id)) {
        option.selected = true;
      }
    });
  }
}
