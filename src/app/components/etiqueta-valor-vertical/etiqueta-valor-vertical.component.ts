import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobentis-etiqueta-valor-vertical',
  templateUrl: './etiqueta-valor-vertical.component.html',
  styleUrls: ['./etiqueta-valor-vertical.component.scss']
})
export class EtiquetaValorVerticalComponent {
  @Input() etiqueta!: string | null | undefined;
  @Input() valor!: string | number | null | undefined;
  @Input() colorEtiqueta!: string | null | undefined;
}
