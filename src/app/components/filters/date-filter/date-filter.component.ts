import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  @Input() id: string = '';
  @Output() dateSelection = new EventEmitter<string>();


  dateOptions = ['Último mes', 'Última semana', 'Últimos 30 días', 'Últimos 15 días'];

  selectDate(option: string) {
    this.dateSelection.emit(option);
  }

  reset(){
    
  }
  update(filtroAplicado: { id: string; nombre: string; valor: any; tipo: string }){
    
  }
}
