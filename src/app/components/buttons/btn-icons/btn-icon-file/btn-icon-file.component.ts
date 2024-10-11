import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-icon-file',
  templateUrl: './btn-icon-file.component.html',
  styleUrls: ['./btn-icon-file.component.css']
})
export class BtnIconFileComponent {
  @Output() btnClicked = new EventEmitter<void>(); 

  onClick(): void {
    this.btnClicked.emit(); 
  }
}
