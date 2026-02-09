import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'mobentis-btn-facturar',
  templateUrl: './btn-facturar.component.html',
  styleUrls: ['./btn-facturar.component.scss']
})
export class BtnFacturarComponent {
  @Input() disabled: boolean = false;
  @Output() facturarClick = new EventEmitter<void>();

  onFacturarClick(): void {
    if (!this.disabled) {
      this.facturarClick.emit();
    }
  }
}
