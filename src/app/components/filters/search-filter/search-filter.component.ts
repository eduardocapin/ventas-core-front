import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mobentis-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  @Input() title?: string ;
  @Input() id: string = '';
  @Output() searchChange = new EventEmitter<string>();
  searchTerm: string = '';

  onInputChange() {
    console.log(this.searchTerm)
    this.searchChange.emit(this.searchTerm);
    
  }

  reset(){
    this.searchTerm = ''
    //this.searchChange.emit(this.searchTerm);
  }
}
