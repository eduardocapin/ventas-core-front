import { Component, EventEmitter, Input, Output, ElementRef, HostListener } from '@angular/core';

export interface Empresa {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'app-empresa-dropdown',
  templateUrl: './empresa-dropdown.component.html',
  styleUrls: ['./empresa-dropdown.component.scss']
})
export class EmpresaDropdownComponent {
  //que cargue oninit, que aqui no haya un array y que venga directamente del r.empresasId y que la base de datos
  //Pillar empresas de la dbo.empresas
  @Input() empresas: Empresa[] = [];
  @Output() empresasChange = new EventEmitter<Empresa[]>();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  // Cerrar dropdown al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        // Si se cierra sin ninguna empresa seleccionada, seleccionar todas
        if (!this.algunaSeleccionada()) {
          this.empresas.forEach(e => e.selected = true);
          this.empresasChange.emit(this.empresas);
        }
        this.isOpen = false;
      }
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    // Si se está abriendo, no hacer nada especial
    // Si se está cerrando y no hay selección, seleccionar todas
    if (this.isOpen && !this.algunaSeleccionada()) {
      this.empresas.forEach(e => e.selected = true);
      this.empresasChange.emit(this.empresas);
    }
    this.isOpen = !this.isOpen;
  }

  toggleEmpresa(empresa: Empresa, event: Event): void {
    event.stopPropagation();
    empresa.selected = !empresa.selected;
    this.empresasChange.emit(this.empresas);
  }

  seleccionarTodas(event: Event): void {
    event.stopPropagation();
    this.empresas.forEach(e => e.selected = true);
    this.empresasChange.emit(this.empresas);
  }

  // Obtener etiqueta para el botón
  getLabel(): string {
    const seleccionadas = this.empresas.filter(e => e.selected);
    if (seleccionadas.length === this.empresas.length) {
      return 'Todas las empresas';
    } else if (seleccionadas.length === 1) {
      return seleccionadas[0].name;
    } else if (seleccionadas.length > 1) {
      return `${seleccionadas.length} empresas`;
    } else {
      return 'Ninguna empresa';
    }
  }

  // Verificar si todas están seleccionadas
  todasSeleccionadas(): boolean {
    return this.empresas.every(e => e.selected);
  }

  // Verificar si al menos una está seleccionada
  algunaSeleccionada(): boolean {
    return this.empresas.some(e => e.selected);
  }

  // Obtener el conteo de empresas seleccionadas
  getSelectedCount(): number {
    return this.empresas.filter(e => e.selected).length;
  }
}
