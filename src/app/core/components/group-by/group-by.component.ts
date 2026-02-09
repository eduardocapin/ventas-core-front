import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { IGroupOption } from 'src/app/models/groupOption.model';
import { GroupByService } from 'src/app/services/group-by/group-by.service';

// Extender IGroupOption para incluir selected
interface IGroupOptionWithSelection extends IGroupOption {
  selected?: boolean;
}

@Component({
  selector: 'mobentis-group-by',
  templateUrl: './group-by.component.html',
  styleUrls: ['./group-by.component.scss']
})
export class GroupByComponent implements OnInit {
  @Input() componentId: string = '';
  @Input() title: string = 'Agrupar';
  @Input() defaultGroupBy?: IGroupOption;
  @Output() groupByChanged = new EventEmitter<IGroupOption | null>();

  options: IGroupOptionWithSelection[] = [];
  filteredOptions: IGroupOptionWithSelection[] = [];
  displayedOptions: IGroupOptionWithSelection[] = [];
  selectedOption: IGroupOption | null = null;
  searchTerm: string = '';

  itemsPerPage = 50;
  currentPage = 1;

  constructor(
    private groupByService: GroupByService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (this.componentId) {
      this.groupByService.getGroupByOptions(this.componentId).subscribe({
        next: (options) => {
          this.options = (options || []).map(opt => ({ ...opt, selected: false }));
          
          // Agregar opción combinada "Equipos - Agentes" si existen ambas opciones
          /* this.addCombinedTeamAgentOption(); */
          
          // Agregar opción combinada "Equipos - Incentivos" si existen ambas opciones
          this.addCombinedTeamIncentiveOption();
          
          // Si hay una agrupación por defecto, seleccionarla automáticamente
          if (this.defaultGroupBy) {
            // Si tiene childGroupBy, agregarlo a las opciones para que se muestre en la UI
            if (this.defaultGroupBy.childGroupBy && !this.options.find(opt => opt.id === this.defaultGroupBy!.id)) {
              this.options = [{ ...this.defaultGroupBy, selected: false }, ...this.options];
            }
            this.selectDefaultGroupBy();
          }
          
          this.filteredOptions = [...this.options];
          this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
        },
        error: (error) => {
          console.error('Error al cargar opciones de agrupación:', error);
          this.options = [];
          // Si hay error pero hay defaultGroupBy, usarlo directamente
          if (this.defaultGroupBy) {
            this.options = [{ ...this.defaultGroupBy, selected: false }];
            this.selectDefaultGroupBy();
          }
          this.filteredOptions = [...this.options];
          this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
        }
      });
    } else if (this.defaultGroupBy) {
      // Si no hay componentId pero hay defaultGroupBy, usar directamente
      this.options = [{ ...this.defaultGroupBy, selected: false }];
      this.filteredOptions = [...this.options];
      this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
      this.selectDefaultGroupBy();
    }
  }

  private selectDefaultGroupBy(): void {
    if (!this.defaultGroupBy) return;

    // Si el defaultGroupBy tiene childGroupBy, usar directamente el defaultGroupBy completo
    // porque las opciones del backend no incluyen la información de childGroupBy
    if (this.defaultGroupBy.childGroupBy) {
      this.selectedOption = this.defaultGroupBy;
      const option = this.options.find(opt => this.getOptionKey(opt) === this.getOptionKey(this.defaultGroupBy!));
      if (option) {
        option.selected = true;
      }
      this.cdr.markForCheck(); // Forzar detección de cambios
      setTimeout(() => {
        this.emitSelection();
      }, 100);
      return;
    }

    // Buscar la opción que coincida con defaultGroupBy (solo si no tiene childGroupBy)
    let matchingOption = this.options.find(opt => {
      // Coincidencia por ID
      if (this.defaultGroupBy!.id && opt.id === this.defaultGroupBy!.id) {
        return true;
      }
      
      // Coincidencia exacta por field
      if (this.defaultGroupBy!.field && opt.field === this.defaultGroupBy!.field) {
        return true;
      }
      
      // Coincidencia parcial por field (ej: 'incentive.id_team' vs 'id_team')
      if (this.defaultGroupBy!.field && opt.field) {
        const defaultFieldParts = this.defaultGroupBy!.field.split('.');
        const optFieldParts = opt.field.split('.');
        const defaultFieldLast = defaultFieldParts[defaultFieldParts.length - 1];
        const optFieldLast = optFieldParts[optFieldParts.length - 1];
        
        if (defaultFieldLast === optFieldLast) {
          return true;
        }
      }
      
      return false;
    });

    if (matchingOption) {
      this.selectedOption = matchingOption;
      matchingOption.selected = true;
      this.cdr.markForCheck(); // Forzar detección de cambios
      // Emitir después de un pequeño delay para asegurar que el componente padre esté listo
      setTimeout(() => {
        this.emitSelection();
      }, 100);
    } else {
      console.warn('No se encontró una opción de agrupación que coincida con defaultGroupBy:', this.defaultGroupBy);
      console.log('Opciones disponibles:', this.options);
    }
  }

  getOptionKey(option: IGroupOption): string {
    return option.id || option.field || '';
  }

  /**
   * Busca si existen opciones de Equipo y Agente, y si ambas existen,
   * agrega una opción combinada "Equipos - Agentes" con childGroupBy configurado
   */
  /* private addCombinedTeamAgentOption(): void {
    // Buscar opción de Equipo
    const equipoOption = this.options.find(opt => 
      opt.field === 'idEquipoVenta' || opt.endpoint === 'incentive-team'
    );
    
    // Buscar opción de Agente
    const agenteOption = this.options.find(opt => 
      opt.field === 'idAgente' || 
      opt.endpoint === 'incentive-agent' || 
      opt.endpoint === 'monthly-goal-agent'
    );
    
    // Si existen ambas opciones, crear la opción combinada
    if (equipoOption && agenteOption) {
      // Verificar si ya existe una opción combinada (por si ya existe en la BD)
      const combinedExists = this.options.find(opt => 
        opt.name === 'Equipos - Agentes' || 
        (opt.field === equipoOption.field && opt.childGroupBy?.field === agenteOption.field)
      );
      
      if (!combinedExists) {
        // Crear la opción combinada con childGroupBy
        const combinedOption: IGroupOptionWithSelection = {
          id: `combined-${equipoOption.id || equipoOption.field}-${agenteOption.id || agenteOption.field}`,
          name: 'Equipos - Agentes',
          field: equipoOption.field,
          endpoint: equipoOption.endpoint,
          hideField: equipoOption.hideField,
          childGroupBy: {
            id: agenteOption.id,
            name: agenteOption.name,
            field: agenteOption.field,
            endpoint: agenteOption.endpoint,
            hideField: agenteOption.hideField
          },
          selected: false
        };
        
        // Agregar la opción combinada al inicio de la lista
        this.options.unshift(combinedOption);
      }
    }
  } */

  /**
   * Busca si existen opciones de Equipo e Incentivo, y si ambas existen,
   * agrega una opción combinada "Equipos - Incentivos" con childGroupBy configurado
   */
  private addCombinedTeamIncentiveOption(): void {
    // Buscar opción de Equipo
    const equipoOption = this.options.find(opt => 
      opt.field === 'idEquipoVenta' || opt.endpoint === 'incentive-team'
    );
    
    // Buscar opción de Incentivo
    const incentivoOption = this.options.find(opt => 
      opt.field === 'idIncentivo' || opt.endpoint === 'incentive'
    );
    
    // Si existen ambas opciones, crear la opción combinada
    if (equipoOption && incentivoOption) {
      // Verificar si ya existe una opción combinada (por si ya existe en la BD)
      const combinedExists = this.options.find(opt => 
        opt.name === 'Equipos - Incentivos' || 
        (opt.field === equipoOption.field && opt.childGroupBy?.field === incentivoOption.field)
      );
      
      if (!combinedExists) {
        // Crear la opción combinada con childGroupBy
        const combinedOption: IGroupOptionWithSelection = {
          id: `combined-${equipoOption.id || equipoOption.field}-${incentivoOption.id || incentivoOption.field}`,
          name: 'Equipos - Incentivos',
          field: equipoOption.field,
          endpoint: equipoOption.endpoint,
          hideField: equipoOption.hideField,
          childGroupBy: {
            id: incentivoOption.id,
            name: incentivoOption.name,
            field: incentivoOption.field,
            endpoint: incentivoOption.endpoint,
            hideField: incentivoOption.hideField
          },
          selected: false
        };
        
        // Agregar la opción combinada al inicio de la lista
        this.options.unshift(combinedOption);
      }
    }
  }

  onDropdownOpen() {
    // No necesitamos cargar nada adicional, las opciones ya están cargadas
  }

  oninputChange() {
    if (this.searchTerm.length >= 1) {
      this.filteredOptions = this.options.filter(option => 
        option.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredOptions = [...this.options];
    }
    this.currentPage = 1;
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
  }

  onScroll(event: any) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
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

  toggleSelection(option: IGroupOptionWithSelection) {
    // Si ya está seleccionada, deseleccionar
    if (this.selectedOption && this.getOptionKey(this.selectedOption) === this.getOptionKey(option)) {
      // Deseleccionar la opción anterior
      const prevOption = this.options.find(opt => this.getOptionKey(opt) === this.getOptionKey(this.selectedOption!));
      if (prevOption) {
        prevOption.selected = false;
      }
      this.selectedOption = null;
      option.selected = false;
    } else {
      // Deseleccionar la opción anterior si existe
      if (this.selectedOption) {
        const prevOption = this.options.find(opt => this.getOptionKey(opt) === this.getOptionKey(this.selectedOption!));
        if (prevOption) {
          prevOption.selected = false;
        }
      }
      // Seleccionar la nueva opción
      this.selectedOption = option;
      option.selected = true;
    }
    this.cdr.markForCheck(); // Forzar detección de cambios
    this.emitSelection();
  }

  private emitSelection() {
    this.groupByChanged.emit(this.selectedOption);
  }

  reset() {
    if (this.selectedOption) {
      const prevOption = this.options.find(opt => this.getOptionKey(opt) === this.getOptionKey(this.selectedOption!));
      if (prevOption) {
        prevOption.selected = false;
      }
    }
    this.selectedOption = null;
    this.filteredOptions = [...this.options];
    this.displayedOptions = this.filteredOptions.slice(0, this.itemsPerPage);
    this.searchTerm = '';
    this.cdr.markForCheck(); // Forzar detección de cambios
    this.groupByChanged.emit(null);
  }

  removeOption() {
    if (this.selectedOption) {
      const option = this.options.find(opt => this.getOptionKey(opt) === this.getOptionKey(this.selectedOption!));
      if (option) {
        option.selected = false;
      }
      this.selectedOption = null;
      this.cdr.markForCheck(); // Forzar detección de cambios
      this.emitSelection();
    }
  }
}