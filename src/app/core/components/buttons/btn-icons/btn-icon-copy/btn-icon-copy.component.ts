import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'mobentis-btn-icon-copy',
  templateUrl: './btn-icon-copy.component.html',
  styleUrls: ['./btn-icon-copy.component.scss']
})
export class BtnIconCopyComponent {
  @Output() btnClicked = new EventEmitter<void>(); 

  onClick(): void {
    this.btnClicked.emit(); 
  }
}

