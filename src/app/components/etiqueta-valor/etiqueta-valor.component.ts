import { Component, Input } from '@angular/core';

@Component({
  selector: 'mobentis-etiqueta-valor',
  templateUrl: './etiqueta-valor.component.html',
  styleUrls: ['./etiqueta-valor.component.scss'],
})
export class EtiquetaValorComponent {
  @Input() etiqueta!: string | null | undefined;
  @Input() valor!: string | number | null | undefined;
  
}
