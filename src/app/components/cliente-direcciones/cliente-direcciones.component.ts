import { Component, Input } from '@angular/core';
import { TranslationService } from 'src/app/i18n/translation.service';

@Component({
  selector: 'mobentis-cliente-direcciones',
  templateUrl: './cliente-direcciones.component.html',
  styleUrls: ['./cliente-direcciones.component.css']
})
export class ClienteDireccionesComponent {
  @Input() id_cliente!: number;  

  adressesList: any[] = [];
  cargando: boolean = false;

  constructor(public translationService: TranslationService) {}
}
