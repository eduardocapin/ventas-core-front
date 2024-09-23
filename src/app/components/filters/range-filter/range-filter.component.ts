import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.css']
})
export class RangeFilterComponent {
  @Output() rangeSelected = new EventEmitter<{ min: number, max: number }>();

  min: number = 0;
  max: number = 100;

  applyRange() {
    this.rangeSelected.emit({ min: this.min, max: this.max });
  }
}
