import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-export',
  templateUrl: './btn-export.component.html',
  styleUrls: ['./btn-export.component.scss']
})
export class BtnExportComponent {
  @Output() formatSelected = new EventEmitter<string>(); 


  exportData(format: string): void {
    this.formatSelected.emit(format); 
  }
}
