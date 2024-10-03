import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit {
  @Input() id: string = '';
  @Output() dateSelection = new EventEmitter<{ startDate: string, endDate: string }>();
  @Input() title: string = 'Seleccionar';

  dateOptions: string[] = [];
  customStartDate: string = '';
  customEndDate: string = '';

  ngOnInit() {
    this.updateDateOptions();
  }

  updateDateOptions() {
    const today = new Date();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const currentMonth = monthNames[today.getMonth()];
    
    this.dateOptions = [
      'Hoy', 'Ayer', 'Semana anterior', 'Mes actual', 'Mes anterior',
      'Últimos 3 meses', 'Últimos 6 meses', 'Año actual', 'Año anterior', 
      `${currentMonth} del Año pasado`  // Actualiza esta opción
    ];
  }

  selectDate(option: string) {
    let startDate: string | undefined;
    let endDate: string | undefined;

    const today = new Date();

    switch (option) {
      case 'Hoy':
        startDate = this.formatDate(today);
        endDate = this.formatDate(today);
        break;
      case 'Ayer':
        today.setDate(today.getDate() - 1);
        startDate = this.formatDate(today);
        endDate = this.formatDate(today);
        break;
      case 'Semana anterior':
        const currentDay = today.getDay();
        const startOfLastWeek = new Date(today);
        const daysToSubtractForMonday = currentDay === 0 ? 6 : currentDay - 1;
        startOfLastWeek.setDate(today.getDate() - daysToSubtractForMonday - 7);
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);

        startDate = this.formatDate(startOfLastWeek);
        endDate = this.formatDate(endOfLastWeek);
        break;
      case 'Mes actual':
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        startDate = this.formatDate(currentMonthStart);
        endDate = this.formatDate(currentMonthEnd);
        break;
      case 'Mes anterior':
        const lastMonth = new Date(today);
        lastMonth.setMonth(today.getMonth() - 1);
        startDate = this.getFirstDayOfMonth(lastMonth);
        endDate = this.getLastDayOfMonth(lastMonth);
        break;
      case 'Últimos 3 meses':
        const threeMonthsAgo = new Date(today);
        threeMonthsAgo.setMonth(today.getMonth() - 3);
        startDate = this.formatDate(threeMonthsAgo);
        endDate = this.formatDate(today);
        break;
      case 'Últimos 6 meses':
        const sixMonthsAgo = new Date(today);
        sixMonthsAgo.setMonth(today.getMonth() - 6);
        startDate = this.formatDate(sixMonthsAgo);
        endDate = this.formatDate(today);
        break;
      case 'Año actual':
        startDate = this.getFirstDayOfYear(today);
        endDate = this.getLastDayOfYear(today);
        break;
      case 'Año anterior':
        const lastYear = new Date(today);
        lastYear.setFullYear(today.getFullYear() - 1);
        startDate = this.getFirstDayOfYear(lastYear);
        endDate = this.getLastDayOfYear(lastYear);
        break;
      case `${this.getMonthName(today.getMonth())} del Año pasado`:
        const lastYearSameMonth = new Date(today);
        lastYearSameMonth.setFullYear(today.getFullYear() - 1);
        startDate = this.getFirstDayOfMonth(lastYearSameMonth);
        endDate = this.getLastDayOfMonth(lastYearSameMonth);
        break;
      default:
        console.error('Opción no válida');
        break;
    }

    if (startDate && endDate) {
      this.dateSelection.emit({ startDate, endDate });
    } else {
      console.error('Error: Las fechas no están correctamente definidas');
    }
  }

  getMonthName(monthIndex: number): string {
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return monthNames[monthIndex];
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getFirstDayOfMonth(date: Date): string {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    return this.formatDate(firstDay);
  }

  getLastDayOfMonth(date: Date): string {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return this.formatDate(lastDay);
  }

  getFirstDayOfYear(date: Date): string {
    const firstDay = new Date(date.getFullYear(), 0, 1);
    return this.formatDate(firstDay);
  }

  getLastDayOfYear(date: Date): string {
    const lastDay = new Date(date.getFullYear(), 11, 31);
    return this.formatDate(lastDay);
  }

  applyCustomDate() {
    if (this.customStartDate && this.customEndDate) {
      this.dateSelection.emit({ startDate: this.customStartDate, endDate: this.customEndDate });
    } else {
      alert('Por favor selecciona ambas fechas');
    }
  }

  reset() {
    this.customStartDate = '';
    this.customEndDate = '';
  }

  update(filtroAplicado: { id: string; nombre: string; valor: any; tipo: string }) {
    if (filtroAplicado.tipo === 'date') {
      this.customStartDate = filtroAplicado.valor.startDate;
      this.customEndDate = filtroAplicado.valor.endDate;
    }
  }
}
