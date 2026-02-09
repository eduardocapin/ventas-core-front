import { Component, EventEmitter, Input, Output, ElementRef, HostListener, OnInit } from '@angular/core';
import { CompaniesService } from 'src/app/services/empresas/companies.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LoginService } from 'src/app/services/auth/login.service';

export interface Company {
  id: number;
  name: string;
  selected: boolean;
}

@Component({
  selector: 'mobentis-company-dropdown',
  templateUrl: './company-dropdown.component.html',
  styleUrls: ['./company-dropdown.component.scss']
})
export class CompanyDropdownComponent implements OnInit {
  @Input() companiesList?: Company[]; // Empresas filtradas desde el componente padre
  companies: Company[] = [];
  @Output() companiesChange = new EventEmitter<Company[]>();

  isOpen = false;
  showDropdown = false;
  private storageKey = 'selectedEmpresas';

  constructor(
    private elementRef: ElementRef,
    private companiesService: CompaniesService,
    private notificationService: NotificationService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    // Cargar empresas del usuario y determinar si mostrar el dropdown
    this.loadUserCompaniesAndDetermineVisibility();
  }

  /**
   * Cargar empresas del usuario y determinar si mostrar el dropdown
   */
  loadUserCompaniesAndDetermineVisibility(): void {
    this.loginService.getCurrentUserProfile().subscribe({
      next: (userProfile) => {
        const userCompanies = userProfile.empresas || [];
        
        // Si el usuario no tiene empresas asignadas, no mostrar dropdown ni datos
        if (userCompanies.length === 0) {
          this.showDropdown = false;
          this.companies = [];
          this.companiesChange.emit(this.companies);
          return;
        }
        
        // Si tiene solo 1 empresa, ocultar dropdown pero cargar datos
        if (userCompanies.length === 1) {
          this.showDropdown = false;
          this.companies = [{
            id: userCompanies[0].id,
            name: userCompanies[0].nombre,
            selected: true
          }];
          this.companiesChange.emit(this.companies);
          return;
        }
        
        // Si tiene 2 o más empresas, mostrar dropdown con solo sus empresas
        this.showDropdown = true;
        this.loadCompaniesFilteredByUser(userCompanies);
      },
      error: (error) => {
        console.error('Error al cargar empresas del usuario:', error);
        // Si hay error, no mostrar dropdown
        this.showDropdown = false;
        this.companies = [];
        this.companiesChange.emit(this.companies);
      }
    });
  }

  /**
   * Cargar empresas filtradas por las asignadas al usuario
   */
  loadCompaniesFilteredByUser(userCompanies: { id: number; nombre: string }[]): void {
    const savedSelection = this.getSelectionFromStorage();
    
    this.companies = userCompanies.map(company => ({
      id: company.id,
      name: company.nombre,
      selected: savedSelection ? savedSelection.includes(company.id) : true
    }));

    // Si ninguna empresa está seleccionada, seleccionar todas
    if (!this.algunaSeleccionada()) {
      this.companies.forEach(c => c.selected = true);
    }
    
    this.companiesChange.emit(this.companies);
    this.saveSelectionToStorage();
  }

  loadCompanies(): void {
    // Si se pasó una lista de empresas filtradas, usarla
    if (this.companiesList && this.companiesList.length > 0) {
      this.companies = this.companiesList;
      this.companiesChange.emit(this.companies);
      this.saveSelectionToStorage();
      return;
    }

    // Si no, cargar todas las empresas desde el servicio
    this.companiesService.getAllCompanies().subscribe({
      next: (data) => {
        const savedSelection = this.getSelectionFromStorage();
        this.companies = data.map((company: any) => ({
          id: company.company_id,
          name: company.company_name,
          selected: savedSelection ? savedSelection.includes(company.company_id) : true
        }));

        // Si ninguna empresa queda seleccionada (p.ej. las guardadas ya no existen), seleccionar todas
        if (!this.algunaSeleccionada()) {
          this.companies.forEach(c => c.selected = true);
        }
        
        this.companiesChange.emit(this.companies);
        this.saveSelectionToStorage();
      },
      error: (error) => {
        console.error('Error al cargar las empresas:', error);
      }
    });
  }

  private saveSelectionToStorage(): void {
    const selectedIds = this.companies.filter(c => c.selected).map(c => c.id);
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

  toggleCompany(company: Company, event: Event): void {
    event.stopPropagation();
    const seleccionadasCount = this.getSelectedCount();

    if (company.selected && seleccionadasCount === 1) {
      this.notificationService.showWarning('Debe seleccionar al menos una empresa');
      return;
    }
    
    company.selected = !company.selected;
    this.companiesChange.emit(this.companies);
    this.saveSelectionToStorage();
  }

  seleccionarTodas(event: Event): void {
    event.stopPropagation();
    this.companies.forEach(c => c.selected = true);
    this.companiesChange.emit(this.companies);
    this.saveSelectionToStorage();
  }

  // Obtener etiqueta para el botón
  getLabel(): string {
    const seleccionadas = this.companies.filter(c => c.selected);
    if (seleccionadas.length === this.companies.length) {
      return 'Todas las empresas';
    } else if (seleccionadas.length === 1) {
      return seleccionadas[0].name;
    } else if (seleccionadas.length > 1) {
      return `${seleccionadas.length} empresas`;
    } else {
      return 'Sin empresa';
    }
  }

  // Verificar si todas están seleccionadas
  todasSeleccionadas(): boolean {
    return this.companies.every(c => c.selected);
  }

  // Verificar si al menos una está seleccionada
  algunaSeleccionada(): boolean {
    return this.companies.some(c => c.selected);
  }

  // Obtener el conteo de empresas seleccionadas
  getSelectedCount(): number {
    return this.companies.filter(c => c.selected).length;
  }
}

