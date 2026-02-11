import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit } from '@angular/core';
import { ConfigurationService } from 'src/app/core/services/configuration/configuration.service';
import { EmpresasService } from 'src/app/core/services/empresa/empresas.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TranslationService } from 'src/app/core/services/i18n/translation.service';
import { UsersService } from '../../services/users/users.service';

export interface Empresa {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'mobentis-empresa-dropdown',
  templateUrl: './empresa-dropdown.component.html',
  styleUrls: ['./empresa-dropdown.component.scss']
})
export class EmpresaDropdownComponent implements OnInit {
  @Input() empresasList?: Empresa[]; // Empresas filtradas desde el componente padre
  @Input() forceShow: boolean = false; // Si es true, mostrar siempre sin verificar configuración
  empresas: Empresa[] = [];
  @Output() empresasChange = new EventEmitter<Empresa[]>();

  isOpen = false;
  showDropdown = false;
  private storageKey = 'selectedEmpresas';

  constructor(
    private elementRef: ElementRef,
    private configurationService: ConfigurationService,
    private empresasService: EmpresasService,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private translationService: TranslationService
    ) {}

  ngOnInit(): void {
    if (this.forceShow) {
      // Si forceShow está activado, cargar empresas directamente sin verificar configuración
      this.loadUserEmpresasAndDetermineVisibility();
      return;
    }
    
    // Lógica existente con configuración
    // Primero verificar la configuración global del dropdown
    this.configurationService.getConfigurationByName('converterEMPRESA_DROPDOWN_ACTIVO').subscribe({
      next: (config) => {
        const isDropdownEnabled = config && (config.Valor === true || config.Valor === 'true' || config.Valor === 'True');
        
        if (isDropdownEnabled) {
          // Si está habilitado globalmente, cargar empresas del usuario
          this.loadUserEmpresasAndDetermineVisibility();
        } else {
          this.showDropdown = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar la configuración del dropdown:', error);
        this.showDropdown = false;
      }
    });
  }

  /**
   * Cargar empresas del usuario y determinar si mostrar el dropdown
   */
  loadUserEmpresasAndDetermineVisibility(): void {
    this.usersService.getCurrentUserProfile().subscribe({
      next: (userProfile) => {
        const userEmpresas = userProfile.empresas || [];
        
        // Si el usuario no tiene empresas asignadas, no mostrar dropdown ni datos
        if (userEmpresas.length === 0) {
          this.showDropdown = false;
          this.empresas = [];
          this.empresasChange.emit(this.empresas);
          return;
        }
        
        // Si tiene solo 1 empresa, ocultar dropdown pero cargar datos
        if (userEmpresas.length === 1) {
          this.showDropdown = false;
          this.empresas = [{
            id: userEmpresas[0].id,
            name: userEmpresas[0].nombre,
            selected: true
          }];
          // Emitir el evento de forma asíncrona
          setTimeout(() => {
            this.empresasChange.emit(this.empresas);
          }, 0);
          return;
        }
        
        // Si tiene 2 o más empresas, mostrar dropdown con solo sus empresas
        this.showDropdown = true;
        this.loadEmpresasFilteredByUser(userEmpresas);
      },
      error: (error) => {
        console.error('Error al cargar empresas del usuario:', error);
        // Si hay error, no mostrar dropdown
        this.showDropdown = false;
        this.empresas = [];
        this.empresasChange.emit(this.empresas);
      }
    });
  }

  /**
   * Cargar empresas filtradas por las asignadas al usuario
   */
  loadEmpresasFilteredByUser(userEmpresas: { id: number; nombre: string }[]): void {
    const savedSelection = this.getSelectionFromStorage();
    
    this.empresas = userEmpresas.map(empresa => ({
      id: empresa.id,
      name: empresa.nombre,
      selected: savedSelection ? savedSelection.includes(empresa.id) : true
    }));

    // Si ninguna empresa está seleccionada, seleccionar todas
    if (!this.algunaSeleccionada()) {
      this.empresas.forEach(e => e.selected = true);
    }
    
    // Emitir el evento de forma asíncrona para asegurar que el componente padre esté listo
    setTimeout(() => {
      this.empresasChange.emit(this.empresas);
    }, 0);
    this.saveSelectionToStorage();
  }

  loadEmpresas(): void {
    // Si se pasó una lista de empresas filtradas, usarla
    if (this.empresasList && this.empresasList.length > 0) {
      this.empresas = this.empresasList;
      this.empresasChange.emit(this.empresas);
      this.saveSelectionToStorage();
      return;
    }

    // Si no, cargar todas las empresas desde el servicio
    this.empresasService.getEmpresas().subscribe({
      next: (data) => {
        const savedSelection = this.getSelectionFromStorage();
        this.empresas = data.map(empresa => ({
          id: empresa.idEmpresa,
          name: empresa.Nombre,
          selected: savedSelection ? savedSelection.includes(empresa.idEmpresa) : true
        }));

        // Si ninguna empresa queda seleccionada (p.ej. las guardadas ya no existen), seleccionar todas
        if (!this.algunaSeleccionada()) {
          this.empresas.forEach(e => e.selected = true);
        }
        
        this.empresasChange.emit(this.empresas);
        this.saveSelectionToStorage();
      },
      error: (error) => {
        console.error('Error al cargar las empresas:', error);
      }
    });
  }

  private saveSelectionToStorage(): void {
    const selectedIds = this.empresas.filter(e => e.selected).map(e => e.id);
    localStorage.setItem(this.storageKey, JSON.stringify(selectedIds));
  }

  private getSelectionFromStorage(): number[] | null {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : null;
  }

  // Cerrar dropdown al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      if (this.isOpen) {
        this.isOpen = false;
      }
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  toggleEmpresa(empresa: Empresa, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    // Contar empresas seleccionadas ANTES de cambiar el estado
    const seleccionadasCountAntes = this.getSelectedCount();
    const nuevaSeleccion = !empresa.selected;

    // Solo mostrar advertencia si realmente está intentando deseleccionar la última empresa seleccionada
    if (empresa.selected && seleccionadasCountAntes === 1) {
      this.notificationService.showWarning(this.translationService.t('empresaDropdown.warning.minOneRequired'));
      return;
    }
    
    // Actualizar el estado
    empresa.selected = nuevaSeleccion;
    
    this.empresasChange.emit(this.empresas);
    this.saveSelectionToStorage();
  }

  seleccionarTodas(event: Event): void {
    event.stopPropagation();
    this.empresas.forEach(e => e.selected = true);
    this.empresasChange.emit(this.empresas);
    this.saveSelectionToStorage();
  }

  // Obtener etiqueta para el botón
  getLabel(): string {
    const seleccionadas = this.empresas.filter(e => e.selected);
    if (seleccionadas.length === this.empresas.length) {
      return this.translationService.t('empresaDropdown.allCompanies');
    } else if (seleccionadas.length === 1) {
      return seleccionadas[0].name;
    } else if (seleccionadas.length > 1) {
      return `${seleccionadas.length} ${this.translationService.t('empresaDropdown.companies')}`;
    } else {
      return this.translationService.t('empresaDropdown.noCompany');
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
