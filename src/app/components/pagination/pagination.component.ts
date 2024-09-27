import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
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
  maxVisiblePages: number = 9;

  itemsPerPageOptions: number[] = [5, 10, 20, 50]; // Opciones para el selector

  ngOnInit() {
    this.updatePagination();
  }

  ngOnChanges() {
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.generatePages();
  }

  generatePages() {
    const pagesArray: (number | string)[] = [];

    if (this.totalPages <= this.maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
    } else {
      const startPage = Math.max(3, this.currentPage - 2);
      const endPage = Math.min(this.totalPages - 2, this.currentPage + 2);

      pagesArray.push(1);

      if (this.currentPage <= 3) {
        for (let i = 2; i <= 7; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
      } else if (this.currentPage >= this.totalPages - 2) {
        pagesArray.push('...');
        for (let i = this.totalPages - 6; i < this.totalPages; i++) {
          pagesArray.push(i);
        }
      } else {
        pagesArray.push('...');
        for (let i = startPage; i <= endPage; i++) {
          pagesArray.push(i);
        }
        pagesArray.push('...');
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
