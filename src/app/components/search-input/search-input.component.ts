import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mobentis-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent {
  @Input() searchTerm: string = ''; 
  @Output() searchChange = new EventEmitter<string>();
  @Output() errorDeCaracteres = new EventEmitter<boolean>();
  
  mostrarError: boolean = false;  // Variable para mostrar/ocultar el mensaje de error

  buscar(): void {
    // Verificar si el término contiene caracteres prohibidos
    if (this.hayCaracteresProhibidos(this.searchTerm)) {
      this.mostrarError = true;  // Mostrar el mensaje de error
      this.errorDeCaracteres.emit(true);  // Emitimos error
      return;  // Salir de la función para prevenir la búsqueda
    } else {
      this.mostrarError = false;  // Ocultar el mensaje de error
      this.errorDeCaracteres.emit(false);  // No hay error
      // Emitir el término de búsqueda solo si es válido
      this.searchChange.emit(this.searchTerm);
    }
  }

  onSearchTermChange(): void {
    // Validar si se están usando caracteres prohibidos mientras se escribe
    if (this.hayCaracteresProhibidos(this.searchTerm)) {
      this.mostrarError = true;
      this.errorDeCaracteres.emit(true);  // Emitimos error
    } else {
      this.mostrarError = false;
      this.errorDeCaracteres.emit(false);  // No hay error
    }
  }

  hayCaracteresProhibidos(termino: string): boolean {
    const caracteresProhibidos = /["'`]/g;
    return caracteresProhibidos.test(termino);
  }
}
