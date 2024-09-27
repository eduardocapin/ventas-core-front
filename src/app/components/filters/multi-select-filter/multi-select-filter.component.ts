import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
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

  constructor(private _filterService: FilterService) {
  }

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
      },
      (error) => {
        console.error('Error al cargar las opciones:', error);
      }
    );
  }
  onSearchChange() {
    this.filteredOptions = this.options.filter((option) =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelection(option: any) {
    const index = this.selectedOptions.indexOf(option);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option);
    }
    console.log(this.title);
    console.log(this.selectedOptions);
    this.selectionChange.emit(this.selectedOptions);
  }

  reset() {
    this.selectedOptions = [];
    this.filteredOptions = this.options;
    this.searchTerm = '';
    //this.selectionChange.emit(this.selectedOptions);
  }
  update(filtroAplicado: { id: string; nombre: string; valor: any; tipo: string }){
    
  }
}
