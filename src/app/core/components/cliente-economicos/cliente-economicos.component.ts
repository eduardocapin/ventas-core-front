import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/clients.model';

@Component({
  selector: 'mobentis-cliente-economicos',
  templateUrl: './cliente-economicos.component.html',
  styleUrls: ['./cliente-economicos.component.scss']
})
export class ClienteEconomicosComponent {
  @Input() cliente?: IClient;
}
