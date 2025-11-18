import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mobentis-popup-header',
  templateUrl: './popup-header.component.html',
  styleUrls: ['./popup-header.component.scss']
})
export class PopupHeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Input() isBootstrapIcon: boolean = false;
  @Output() close = new EventEmitter<void>();
  
  onClose() {
    this.close.emit();
  }
}
