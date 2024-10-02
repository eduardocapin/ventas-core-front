import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent {
  @Input() id: string = '';
  @Output() dateSelection = new EventEmitter<{ startDate: string, endDate: string }>();
  @Input() title: string = 'Seleccionar';

  dateOptions = ['Mes anterior', 'Última semana', 'Últimos 30 días', 'Últimos 15 días'];

  // Variables para fechas personalizadas
  customStartDate: string = '';
  customEndDate: string = '';

  selectDate(option: string) {
    let startDate: string | undefined;
    let endDate: string | undefined;
  
    // Lógica para definir startDate y endDate según el valor de 'option'
    switch (option) {
      case 'Mes anterior':
        startDate = this.getFirstDayOfPreviousMonth();
        endDate = this.getLastDayOfPreviousMonth();
        break;
      case 'Última semana':
        startDate = this.calculateStartDate(7); // Fecha de hace 7 días
        endDate = this.getTodayDate();
        break;
      case 'Últimos 30 días':
        startDate = this.calculateStartDate(30); // Método para calcular la fecha de hace 30 días
        endDate = this.getTodayDate(); // Método para obtener la fecha actual
        break;
      case 'Últimos 15 días':
        startDate = this.calculateStartDate(15); // Fecha de hace 15 días
        endDate = this.getTodayDate();
        break;
      default:
        // Otras opciones personalizadas
        break;
    }
  
    // Validación para asegurarse de que ambos valores estén definidos
    if (startDate && endDate) {
      this.dateSelection.emit({ startDate, endDate });
    } else {
      console.error('Error: Las fechas no están correctamente definidas');
    }
  }
  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }
  
  calculateStartDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  /// calcular por el mes
  // Obtener el primer día del mes anterior
getFirstDayOfPreviousMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  date.setDate(1);
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}

// Obtener el último día del mes anterior
getLastDayOfPreviousMonth(): string {
  const date = new Date();
  date.setMonth(date.getMonth());
  date.setDate(0); // Esto regresa al último día del mes anterior
  return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
}
// Aplicar fecha personalizada
applyCustomDate() {
    if (this.customStartDate && this.customEndDate) {
      this.dateSelection.emit({ startDate: this.customStartDate, endDate: this.customEndDate });
    } else {
      alert('Por favor selecciona ambas fechas');
    }
  }

  reset(){
    this.customStartDate = '';
    this.customEndDate = '';

  }
  update(filtroAplicado: { id: string; nombre: string; valor: any; tipo: string }) {
    // Aquí puedes manejar cómo actualizar el componente con un filtro guardado
    if (filtroAplicado.tipo === 'date') {
      this.customStartDate = filtroAplicado.valor.startDate;
      this.customEndDate = filtroAplicado.valor.endDate;
    }
  }
}
