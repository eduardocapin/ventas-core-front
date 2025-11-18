import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/clients.model';

@Component({
  selector: 'mobentis-cliente-mas-info',
  templateUrl: './cliente-mas-info.component.html',
  styleUrls: ['./cliente-mas-info.component.scss']
})
export class ClienteMasInfoComponent {
  @Input() cliente?: IClient;
}
