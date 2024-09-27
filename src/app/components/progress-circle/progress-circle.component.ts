import { Component, Input } from '@angular/core';
import { Color } from 'chart.js';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss']
})
export class ProgressCircleComponent {
  @Input() total: number = 1;
  @Input() value: number = 0;
  @Input() size: string = "50px";
  @Input() color: Color = '#87CEFA';
  @Input() text: string = "";
  @Input() backgroundColor: Color = '#f3f4f6';
  percentage: number = 0;
  number: string = "";
  isHovered: boolean = false;

  ngOnInit(): void {
    this.calculatePercentage();
    this.setNumber(); 
  }

  setNumber(): void {
    if (this.value >= 1000) {
      this.number = Math.round(this.value / 100) / 10 + "k";
    } else {
      this.number = this.value.toString();
    }
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
