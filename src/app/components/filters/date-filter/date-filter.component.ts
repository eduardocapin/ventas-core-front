import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.css']
})
export class DateFilterComponent {
  @Output() dateSelection = new EventEmitter<string>();


  dateOptions = ['Último mes', 'Última semana', 'Últimos 30 días', 'Últimos 15 días'];

  selectDate(option: string) {
    this.dateSelection.emit(option);
  }
}
