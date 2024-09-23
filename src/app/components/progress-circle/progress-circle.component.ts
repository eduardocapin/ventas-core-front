import { Component, Input } from '@angular/core';
import { Color } from 'chart.js';

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.css']
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

  // const formatToK = (value) => {
  //   return Math.round(value / 1000) + 'k';
  // };

  // const ProgressCircle = ({ value, total, color, text, innerColor }) => {
  //   const [isHovered, setIsHovered] = useState(false);

  //   // Calcular el porcentaje
  //   const percent = Math.round((value / total) * 100);

  //   return (
  //     <div
  //       className="progress-circle-container"
  //       onMouseEnter={() => setIsHovered(true)}
  //       onMouseLeave={() => setIsHovered(false)}
  //     >
  //       <div
  //         className="progress-circle"
  //         style={{ '--percent': percent, '--color': color, '--inner-color': innerColor }}
  //       >
  //         {/* Mostrar porcentaje o valor formateado según el estado de hover */}
  //         <div className={`progress-text ${isHovered ? 'hidden' : ''}`}>
  //           {percent}%
  //         </div>
  //         <div className="progress-value">
  //           {isHovered ? formatToK(value) : text}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

}
