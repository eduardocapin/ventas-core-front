import { Component, EventEmitter, Input, Output, HostListener, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'mobentis-input-select',
  templateUrl: './input-select.component.html',
  styleUrls: ['./input-select.component.scss']
})
export class InputSelectComponent {
  @Input() title: string = 'Seleccionar';
  @Input() options: any[] = [];
  @Input() selectedValue: any = null;
  @Input() placeholder: string = 'Buscar...';
  @Input() displayField: string = 'name';
  @Input() container: 'body' | '' = '';
  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild('searchInput', { static: false }) searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autocompleteWrapper', { static: false }) autocompleteWrapper!: ElementRef;

  filteredOptions: any[] = [];
  displayedOptions: any[] = [];
  searchTerm: string = '';
  dropdownOpen = false;
  isNearBottom = false;
  highlightedIndex: number = -1;
  dropdownDirection: 'down' | 'up' = 'down';
  dropdownStyles: any = {};

  itemsPerPage = 50;
  currentPage = 1;
  private isSelectingWithKeyboard = false;

  ngOnChanges() {
    this.filteredOptions = [...this.options];
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
    this.highlightedIndex = -1;

    // Actualizar searchTerm cuando cambia selectedValue desde fuera
    if (this.selectedValue) {
      this.searchTerm = this.selectedValue[this.displayField] || '';
    } else {
      this.searchTerm = '';
    }
  }

  toggleDropdown(event: MouseEvent) {
    if (this.dropdownOpen) {
      this.onDropdownClose();
    } else {
      this.onDropdownOpen();
    }
  }

  onDropdownOpen() {
    if (this.dropdownOpen) return;

    this.dropdownOpen = true;
    this.filteredOptions = [...this.options];
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);

    this.calculateDropdownDirection();

    if (!this.selectedValue) {
      this.searchTerm = '';
    }

    this.highlightedIndex = -1;

    setTimeout(() => {
      if (this.searchInput && this.searchInput.nativeElement) {
        this.searchInput.nativeElement.focus();
        this.searchInput.nativeElement.select();
      }
    }, 0);
  }

  onDropdownClose() {
    if (!this.dropdownOpen) return;

    this.dropdownOpen = false;

    if (this.selectedValue) {
      this.searchTerm = this.selectedValue[this.displayField] || '';
    } else {
      this.searchTerm = '';
    }

    this.highlightedIndex = -1;
    this.dropdownDirection = 'down';
  }

  private calculateDropdownDirection() {
    this.dropdownDirection = 'down';

    // Usar tick para asegurar que el DOM está listo
    setTimeout(() => {
      if (!this.autocompleteWrapper?.nativeElement) return;

      const wrapperElement = this.autocompleteWrapper.nativeElement;
      const inputRect = wrapperElement.getBoundingClientRect();

      if (this.container === 'body') {
        this.calculateFixedStyles(inputRect);
      }
    }, 0);
  }

  private calculateFixedStyles(rect: DOMRect) {
    this.dropdownStyles = {
      position: 'fixed',
      width: rect.width + 'px',
      left: rect.left + 'px',
      zIndex: '99999', // El z-index más alto posible
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    };

    if (this.dropdownDirection === 'down') {
      this.dropdownStyles.top = rect.bottom + 6 + 'px';
      this.dropdownStyles.bottom = 'auto';
      // Limitar altura para no salir de la pantalla
      this.dropdownStyles['max-height'] = (window.innerHeight - rect.bottom - 20) + 'px';
    } else {
      this.dropdownStyles.bottom = (window.innerHeight - rect.top + 6) + 'px';
      this.dropdownStyles.top = 'auto';
      // Limitar altura para no salir de la pantalla
      this.dropdownStyles['max-height'] = (rect.top - 20) + 'px';
    }
  }

  onInputChange() {
    if (!this.dropdownOpen) {
      this.onDropdownOpen();
    }

    if (this.searchTerm.length >= 1) {
      this.filteredOptions = this.options.filter(option =>
        (option[this.displayField] || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }

    this.currentPage = 1;
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
    this.highlightedIndex = -1;

    this.calculateDropdownDirection();
  }

  onInputKeyDown(event: KeyboardEvent) {
    if (!this.dropdownOpen) {
      if (event.key === 'Enter' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.onDropdownOpen();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveHighlight(1);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.moveHighlight(-1);
        break;

      case 'Enter':
        event.preventDefault();
        this.selectHighlightedOption();
        break;

      case 'Escape':
        event.preventDefault();
        this.onDropdownClose();
        break;

      case 'Tab':
        this.onDropdownClose();
        break;
    }
  }

  private moveHighlight(direction: number) {
    if (this.displayedOptions.length === 0) return;

    this.isSelectingWithKeyboard = true;

    let newIndex = this.highlightedIndex + direction;

    if (newIndex < 0) {
      newIndex = this.displayedOptions.length - 1;
    } else if (newIndex >= this.displayedOptions.length) {
      newIndex = 0;
    }

    this.highlightedIndex = newIndex;
    this.scrollToHighlighted();

    setTimeout(() => {
      this.isSelectingWithKeyboard = false;
    }, 100);
  }

  private scrollToHighlighted() {
    setTimeout(() => {
      const resultsList = this.autocompleteWrapper.nativeElement.querySelector('.results-list');
      const highlightedElement = resultsList?.querySelector('.result-item.highlighted');

      if (resultsList && highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }, 0);
  }

  private selectHighlightedOption() {
    if (this.highlightedIndex >= 0 && this.highlightedIndex < this.displayedOptions.length) {
      const option = this.displayedOptions[this.highlightedIndex];
      this.selectOption(option);
    } else if (this.filteredOptions.length === 1) {
      this.selectOption(this.filteredOptions[0]);
    }
  }

  onScroll(event: any) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    this.isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      this.loadMoreItems();
    }
  }

  loadMoreItems() {
    const startIndex = this.currentPage * this.itemsPerPage;
    const newItems = this.filteredOptions.slice(startIndex, startIndex + this.itemsPerPage);
    if (newItems.length > 0) {
      this.displayedOptions = [...this.displayedOptions, ...newItems];
      this.currentPage++;
    }
  }

  selectOption(option: any) {
    this.selectedValue = option;
    this.selectionChange.emit(option);
    this.onDropdownClose();

    this.searchTerm = option[this.displayField] || '';
    console.log('Opción seleccionada:', option);
  }

  clearSelection(event?: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.selectedValue = null;
    this.selectionChange.emit(null);
    this.searchTerm = '';
    this.onDropdownOpen();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.dropdownOpen) {
      this.calculateDropdownDirection();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    if (this.dropdownOpen && this.container === 'body') {
      this.calculateDropdownDirection();
    }
  }

  // Capturar scroll en contenedores internos (como mat-dialog-content)
  @HostListener('document:scroll', ['$event'])
  onDocumentScroll(event: Event) {
    if (this.dropdownOpen && this.container === 'body') {
      // Si el elemento que hace scroll contiene el dropdown o es un ancestro del input
      this.calculateDropdownDirection();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.autocompleteWrapper?.nativeElement) return;

    const target = event.target as HTMLElement;
    if (!this.autocompleteWrapper.nativeElement.contains(target)) {
      this.onDropdownClose();
    }
  }

  isHighlighted(index: number): boolean {
    return index === this.highlightedIndex;
  }
}