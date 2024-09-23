import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
  styleUrls: ['./multi-select-filter.component.css']
})
export class MultiSelectFilterComponent {
  @Input() title: string = 'Seleccionar';
  @Input() options: any[] = [];
  @Output() selectionChange = new EventEmitter<any[]>();

  filteredOptions: any[] = [];
  selectedOptions: any[] = [];
  searchTerm: string = '';

  ngOnInit() {

    this.filteredOptions = this.options;
    this.onSearchChange()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && changes['options'].currentValue) {
      this.filteredOptions = changes['options'].currentValue;
    }
  }
  onSearchChange() {
    this.filteredOptions = this.options.filter(option =>
      option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelection(option: any) {
    const index = this.selectedOptions.indexOf(option.id);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    } else {
      this.selectedOptions.push(option.id);
    }
    console.log(this.title)
    console.log(this.selectedOptions)
    this.selectionChange.emit(this.selectedOptions);
  }
}

