import { Component, Input, OnInit } from '@angular/core';
import { ClientContactService } from 'src/app/services/clients/client-contact/client-contact.service';
import { Contact } from 'src/app/models/clientContact.model';
import { timeout } from 'rxjs';
import { TranslationService } from 'src/app/i18n/translation.service';

@Component({
  selector: 'mobentis-cliente-contactos',
  templateUrl: './cliente-contactos.component.html',
  styleUrls: ['./cliente-contactos.component.css']
})
export class ClienteContactosComponent implements OnInit {
  @Input() id_cliente!: number;  

  clientsList: Contact[] = [];
  cargando: boolean = false;

  constructor(
    private _clientContactServices: ClientContactService,
    public translationService: TranslationService
  ) {}

  ngOnInit(): void {
    if (this.id_cliente) {  
      this.cargando = true;
      this._clientContactServices
        .getContacts(this.id_cliente)
        .pipe(timeout(20000))
        .subscribe(
          (data: Contact[]) => {
            this.clientsList = data;
            this.cargando = false;
          },
          (error) => {
            console.error('Error al obtener los contactos:', error);
            this.cargando = false;
          }
        );
    }
  }
}