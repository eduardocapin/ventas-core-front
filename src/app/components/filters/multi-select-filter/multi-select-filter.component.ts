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
  selector: 'app-multi-select-filter',
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
  selectedOptions: any[] = [];
  searchTerm: string = '';

  private optionsSubject = new ReplaySubject<any[]>(1);

  constructor(private _filterService: FilterService) {}

  ngOnInit() {
    if (this.endpoint) {
      this.loadOptions(this.endpoint);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['endpoint'] && changes['endpoint'].currentValue) {
      this.loadOptions(changes['endpoint'].currentValue);
    }
  }

  loadOptions(endpoint: string) {
    this._filterService.getFilterOptions(endpoint).subscribe(
      (options) => {
        this.options = options;
        this.filteredOptions = options;
        this.optionsSubject.next(this.options);
      },
      (error) => {
        console.error('Error al cargar las opciones:', error);
      }
    );
  }
  onSearchChange(event: Event) {
    event.stopPropagation();
    this.filterOptions();
  }

  oninputChange(event: Event) {
    if (this.searchTerm.length >= 4) {
      this.filterOptions();
    } else {
      this.filteredOptions = this.options;
    }
  }

  private filterOptions() {
    this.filteredOptions = this.options.filter((option) =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelection(option: any) {
    option.selected = !option.selected;
    const index = this.selectedOptions.indexOf(option);
    if (option.selected) {
      if (index === -1) {
        this.selectedOptions.push(option);
      }
    } else {
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
    this.selectionChange.emit(this.selectedOptions);
  }

  onCheckboxChange(option: any) {
    const index = this.selectedOptions.indexOf(option);
    if (option.selected) {
      if (index === -1) {
        this.selectedOptions.push(option);
      }
    } else {
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      }
    }
    this.selectionChange.emit(this.selectedOptions);
  }

  reset() {
    this.selectedOptions = [];
    this.options.forEach((option) => {
      option.selected = false;
    });
    this.filteredOptions = this.options;
    this.searchTerm = '';
    /* this.selectionChange.emit(this.selectedOptions); */
  }
  update(filtroAplicado: { id: number; name: string; selected: boolean }[]) {
    // Wait for options to be available before applying the filter
    this.optionsSubject.subscribe((options) => {
      console.log(filtroAplicado);
      console.log(options);

      this.selectedOptions = [];
      options.forEach((option) => {
        const match = filtroAplicado.find(
          (selected) => selected.id === option.id
        );

        if (match) {
          option.selected = true;
          this.selectedOptions.push(option);
        } else {
          option.selected = false;
        }
      });

      // Emit the change in selection
      this.selectionChange.emit(
        this.selectedOptions.length > 0 ? this.selectedOptions : []
      );
    });
  }
}
