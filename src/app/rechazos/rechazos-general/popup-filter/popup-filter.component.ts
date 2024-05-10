import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-popup-filter',
  templateUrl: './popup-filter.component.html',
  styleUrls: ['./popup-filter.component.css']
})
export class PopupFilterComponent {
  isOpen: boolean = false;
  formulario: FormGroup;
  agenteControl = new FormControl();
  clientControl = new FormControl();
  productoControl = new FormControl();
  
  filteredAgenteOptions!: Observable<string[]>;
  filteredClientOptions!: Observable<string[]>;
  filteredProductoOptions!: Observable<string[]>;
  
  selectedRuta: string = '';
  selectedFrente: string = '';
  selectedPoblacion: string = '';
  selectedProvincia: string = '';
  selectedOPB: string = '';
  selectedGrupo: string = '';
  selectedPicos: string = '';
  selectedFamilia: string = '';
  selectedSubfamilia: string = '';
  selectedEstado: string = '';

  favoriteSeason: string = '';
  seasons: string[] = ['Winter', 'Spring', 'Summer', 'Autumn'];

  constructor(private formBuilder: FormBuilder) {
    this.formulario = this.formBuilder.group({});

    // Inicializar otras propiedades aquí si es necesario
  }

  togglePopup() {
    this.isOpen = !this.isOpen;
  }

  closePopup() {
    this.isOpen = true;
  }

  clearFilters() {
    this.agenteControl.reset();
    this.clientControl.reset();
    this.productoControl.reset();
    this.selectedRuta = '';
    this.selectedFrente = '';
    this.selectedPoblacion = '';
    this.selectedProvincia = '';
    this.selectedOPB = '';
    this.selectedGrupo = '';
    this.selectedPicos = '';
    this.selectedFamilia = '';
    this.selectedSubfamilia = '';
    this.selectedEstado = '';
    this.favoriteSeason = '';
  }

  applyFilters() {
    console.log('Filters applied');
  }
}
