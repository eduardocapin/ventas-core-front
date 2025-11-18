import { Component, Input } from '@angular/core';
import { Color } from 'chart.js';

@Component({
  selector: 'mobentis-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
})
export class ProgressCircleComponent {
  @Input() total: number = 1;
  @Input() value: number = 0;
  @Input() size: string = '50px';
  @Input() color: Color = '';
  @Input() text: string = '';
  @Input() backgroundColor: Color = '#f3f4f6';
  percentage: number = 0;
  isHovered: boolean = false;

  ngOnInit(): void {
    this.calculatePercentage();
  }

  setIsHovered(newValue: boolean) {
    this.isHovered = newValue;
  }

  calculatePercentage(): void {
    if (this.total != 0) {
      this.percentage = Math.round((this.value / this.total) * 1000) / 10;
    } else {
      this.percentage = 0;
    }
  }
}
