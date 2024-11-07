import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-update',
  templateUrl: './message-update.component.html',
  styleUrls: ['./message-update.component.scss']
})
export class MessageUpdateComponent {
  @Input() isVisible: boolean = false;
  @Output() saveChanges = new EventEmitter<void>();
}
