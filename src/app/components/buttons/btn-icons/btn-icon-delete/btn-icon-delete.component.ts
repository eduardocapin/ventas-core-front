import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-btn-icon-delete',
  templateUrl: './btn-icon-delete.component.html',
  styleUrls: ['./btn-icon-delete.component.css']
})
export class BtnIconDeleteComponent {
  @Output() btnClicked = new EventEmitter<void>(); 

  onClick(): void {
    this.btnClicked.emit(); 
  }
}
