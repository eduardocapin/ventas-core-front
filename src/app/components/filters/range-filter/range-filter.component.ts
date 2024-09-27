import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss']
})
export class RangeFilterComponent {
  @Input() id: string = '';
  @Output() rangeSelected = new EventEmitter<{ min: number, max: number }>();

  min: number = 0;
  max: number = 0;

  applyRange() {
    this.rangeSelected.emit({ min: this.min, max: this.max });
  }
  
  reset(){
    this.min = 0
    this.max = 0
    //this.rangeSelected.emit({ min: this.min, max: this.max });
  }

  update(filtrosAplicados: { id: string; nombre: string; valor: any; tipo: string }){
    
  }
}
