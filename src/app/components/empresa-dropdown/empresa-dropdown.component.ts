import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/services/configuration.service';

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
export class EmpresaDropdownComponent implements OnInit {
  //que cargue oninit, que aqui no haya un array y que venga directamente del r.empresasId y que la base de datos
  //Pillar empresas de la dbo.empresas
  @Input() empresas: Empresa[] = [];
  @Output() empresasChange = new EventEmitter<Empresa[]>();

  isOpen = false;
  showDropdown = false;

  constructor(
    private elementRef: ElementRef,
    private configurationService: ConfigurationService
    ) {}

  ngOnInit(): void {
    this.configurationService.getConfigurationByName('aiwEMPRESA_DROPDOWN_ACTIVO').subscribe({
      next: (config) => {
        if (config && config.Valor !== undefined && config.Valor !== null) {
          // Asegurar que el valor sea booleano
          this.showDropdown = config.Valor === true || config.Valor === 'true' || config.Valor === 'True';
          console.log('Configuración empresa dropdown cargada:', this.showDropdown);
        } else {
          console.warn('No se encontró la configuración aiwEMPRESA_DROPDOWN_ACTIVO');
          this.showDropdown = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar la configuración del dropdown:', error);
        this.showDropdown = false;
      }
    });
  }

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
