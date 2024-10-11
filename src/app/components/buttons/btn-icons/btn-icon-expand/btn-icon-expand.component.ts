import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-btn-icon-expand',
  templateUrl: './btn-icon-expand.component.html',
  styleUrls: ['./btn-icon-expand.component.scss']
})
export class BtnIconExpandComponent {
  @Input() isExpanded = false; 
  @Output() toggle = new EventEmitter<void>(); 

  onClick(): void {
    this.isExpanded = !this.isExpanded; 
    this.toggle.emit(); 
  }
}
