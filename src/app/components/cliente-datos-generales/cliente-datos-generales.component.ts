import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/clients.model';

@Component({
  selector: 'mobentis-cliente-datos-generales',
  templateUrl: './cliente-datos-generales.component.html',
  styleUrls: ['./cliente-datos-generales.component.scss']
})
export class ClienteDatosGeneralesComponent {
  @Input() cliente?: IClient;
}
