import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.css']
})
export class SearchFilterComponent {
  @Input() title?: string ;
  @Output() searchChange = new EventEmitter<string>();
  searchTerm: string = '';

  onInputChange() {
    this.searchChange.emit(this.searchTerm);
    this.searchTerm = ''
  }
}
