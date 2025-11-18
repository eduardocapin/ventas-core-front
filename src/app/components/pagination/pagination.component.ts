import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  HostListener 
} from '@angular/core';

@Component({
  selector: 'mobentis-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChanged = new EventEmitter<number>();

  totalPages: number = 0;
  pages: (number | string)[] = [];
  maxVisiblePages: number = 7;

  itemsPerPageOptions: number[] = [5, 10, 20, 50]; // Opciones para el selector
  // Variable para saber si estamos en móvil
  isMobile: boolean = false;

  ngOnInit() {
    this.detectMobile();
    this.updatePagination();
  }

  ngOnChanges() {
    this.detectMobile(); // Detectamos el tamaño de la pantalla cada vez que cambia algo
    this.updatePagination();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.detectMobile();
    this.updatePagination();  // Actualizamos la paginación cuando el tamaño cambia
  }

  // Detectamos el tamaño de la pantalla
  detectMobile() {
    this.isMobile = window.innerWidth <= 768;  // Umbral para determinar si es móvil, ajusta según tus necesidades
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.generatePages();
  }

  generatePages() {
    const pagesArray: (number | string)[] = [];

    // Ajustar la lógica según si estamos en móvil o escritorio
    const maxVisible = this.isMobile ? 6 : this.maxVisiblePages; // Menos páginas en móvil


    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      const startPage = Math.max(3, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, this.currentPage + 1);

      pagesArray.push(1);

      if (this.currentPage <= 3) {
        for (let i = 2; i <= maxVisible - 2 ; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
      } else if (this.currentPage >= this.totalPages - 2) {
        pagesArray.push('...');
        for (let i = this.totalPages - maxVisible + 3 ; i < this.totalPages; i++) {
          pagesArray.push(i);
        }
        
      } else {
        pagesArray.push('...');
        for (let i = startPage; i <= endPage; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
        console.log('5')
      }

      pagesArray.push(this.totalPages);
    }

    this.pages = pagesArray;
  }

  changePage(page: number | string) {
    if (typeof page === 'number') {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.pageChange.emit(this.currentPage);
        this.updatePagination();
      }
    }
  }

  onItemsPerPageChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const newItemsPerPage = +target.value;
      this.itemsPerPage = newItemsPerPage;
      this.itemsPerPageChanged.emit(this.itemsPerPage);
      this.updatePagination();
    }
  }
}
