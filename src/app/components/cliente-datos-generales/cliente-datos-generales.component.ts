import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/clients.model';

@Component({
  selector: 'app-cliente-datos-generales',
  templateUrl: './cliente-datos-generales.component.html',
  styleUrls: ['./cliente-datos-generales.component.css']
})
export class ClienteDatosGeneralesComponent {
  @Input() cliente?: IClient;
}
