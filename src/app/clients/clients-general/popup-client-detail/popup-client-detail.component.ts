import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { FormBuilder } from '@angular/forms';

import { timeout } from 'rxjs';
import { IClient } from 'src/app/models/clients.model';
import { ClientsService } from 'src/app/services/clients/clients.service';
import { ClientsGeneralComponent } from '../clients-general.component';
import { ClientContactListComponent } from '../client-contact-list/client-contact-list.component';
import { PopupMapClientsComponent } from '../popup-map-clients/popup-map-clients.component';
@Component({
  selector: 'app-popup-client-detail',
  templateUrl: './popup-client-detail.component.html',
  styleUrls: ['./popup-client-detail.component.css'],
})
export class PopupClientDetailComponent {
  id_cliente: number = 0;
  form: any;
  inactivo: boolean = false;
  tieneAppInWhats: boolean = true;
  pedidoValorado: boolean = true;
  contacts: number = 0;
  cliente?: IClient;
  cargando: boolean = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PopupClientDetailComponent>,
    private fb: FormBuilder,
    private _clientsServices: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      codigo_Cliente: [''],
      nombre: [''],
      cif: [''],
      nombre_Fiscal: [''],
      provincia: [''],
      localidad: [''],
      cp: [''],
      telefono_1: [''],
      telefono_2: [''],
      email: [''],
      segmentacion_1: [''],
      segmentacion_2: [''],
      segmentacion_3: [''],
      direccion: [''],
    });
    this.id_cliente = data.id;
  }

  ngOnInit(): void {
    this.cargando = true;
    this._clientsServices
      .getOneClient(this.id_cliente)
      .pipe(timeout(20000))
      .subscribe(
        (data: any) => {
          const clientsData: any[] = data;
          this.cliente = clientsData[0];
          this.inactivo = clientsData[0].deleted;
          this.contacts = clientsData[0].contacts;
          this.cargando = false;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando = false;
        }
      );
  }

  cerrarPopup() {
    this.dialogRef.close({
      editado: false,
      id: this.id_cliente,
    });
  }

  aceptar() {
    this.dialogRef.close({
      editado: true,
      id: this.id_cliente,
    });
  }

  editContact() {
    const dialogRef = this.dialog.open(ClientContactListComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: this.id_cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);

      console.log('The dialog was closed');
    });
  }

  verEnMapa() {
    const dialogRef = this.dialog.open(PopupMapClientsComponent, {
      width: '80%',
      height: '80%',
      disableClose: true,
      data: {
        clients: [this.cliente],
      },
    });
  }
}
