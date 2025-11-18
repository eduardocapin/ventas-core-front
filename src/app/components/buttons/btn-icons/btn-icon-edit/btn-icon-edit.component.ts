import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mobentis-btn-icon-edit',
  templateUrl: './btn-icon-edit.component.html',
  styleUrls: ['./btn-icon-edit.component.scss']
})
export class BtnIconEditComponent {
  @Output() btnClicked = new EventEmitter<void>(); 

  onClick(): void {
    this.btnClicked.emit(); 
  }
}
