import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Input() searchTerm: string = ''; 
  @Output() searchChange = new EventEmitter<string>(); 


  buscar(): void {
    this.searchChange.emit(this.searchTerm); 
  }

  onSearchTermChange(): void {
    if (this.searchTerm === '') {
      this.buscar(); 
    }

  }
}
