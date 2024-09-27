import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-header',
  templateUrl: './popup-header.component.html',
  styleUrls: ['./popup-header.component.scss']
})
export class PopupHeaderComponent {
  @Input() title: string = '';
  @Input() icon: string = '';
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
