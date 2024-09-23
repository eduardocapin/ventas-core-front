import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/clients.model';

@Component({
  selector: 'app-cliente-economicos',
  templateUrl: './cliente-economicos.component.html',
  styleUrls: ['./cliente-economicos.component.css']
})
export class ClienteEconomicosComponent {
  @Input() cliente?: IClient;
}
