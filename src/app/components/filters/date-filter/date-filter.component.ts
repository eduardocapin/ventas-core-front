import { Component, EventEmitter, Input, Output, OnInit, inject, ViewChild} from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'mobentis-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit {
  @Input() id: string = '';
  @Output() dateSelection = new EventEmitter<{ startDate: string, endDate: string }>();
  @Input() title: string = 'Fecha';
  dateOptions: string[] = [];
  customStartDate: string = '';
  customEndDate: string = '';
  
  // Variables para el rango personalizado
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);
  
  hoveredDate: NgbDate | null = null;
  startDate: NgbDate | null = this.calendar.getToday(); // Cambiado a NgbDate
  endDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10); // Cambiado a NgbDate
  
  constructor(
    private toastr: ToastrService,
  ){}

  @ViewChild('dropdown') dropdown!: NgbDropdown; // Referencia al dropdown

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
      `${currentMonth} ${today.getFullYear() - 1}`  // Actualiza esta opción
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
      case `${this.getMonthName(today.getMonth())} ${today.getFullYear() - 1}`:
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

  /* para filtros personalizados */
  applyCustomDate() {
    if (this.startDate && this.endDate) {
      const formattedStartDate = this.formatDate(this.ngbDateToDate(this.startDate));
      const formattedEndDate = this.formatDate(this.ngbDateToDate(this.endDate));
      this.dateSelection.emit({ startDate: formattedStartDate, endDate: formattedEndDate });
      this.dropdown.close(); // Cierra el dropdown después de aplicar el filtro
    } else {
      this.toastr.error('Por favor seleccionar ambas fechas', 'Error');
    }
  }
  // Convierte NgbDate a Date
  ngbDateToDate(ngbDate: NgbDate): Date {
    return new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
  }
  onDateSelection(date: NgbDate) {
		if (!this.startDate && !this.endDate) {
			this.startDate = date;
		} else if (this.startDate && !this.endDate && date && date.after(this.startDate)) {
			this.endDate = date;
		} else {
			this.endDate = null;
			this.startDate = date;
		}
	}

  isHovered(date: NgbDate) {
		return (
			this.startDate && !this.endDate && this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate)
		);
	}
  isInside(date: NgbDate) {
		return this.startDate && date.after(this.startDate) && date.before(this.endDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.startDate) ||
			(this.endDate && date.equals(this.endDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}


  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
		const parsed = this.formatter.parse(input);
		return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
	}
  getValue(event: Event): string {
    const target = event.target as HTMLInputElement;
    return target ? target.value : '';
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

  @ViewChild('datepicker', { static: false }) datepicker?: NgbInputDatepicker // Referencia a NgbDatepickerInput


  // Método que abre el calendario cuando se selecciona "Personalizado"
  openCustomDatepicker(event: MouseEvent): void {
    event.stopPropagation(); // Evita el cierre del dropdown
    this.datepicker?.toggle(); // Abre el calendario
  }
}
