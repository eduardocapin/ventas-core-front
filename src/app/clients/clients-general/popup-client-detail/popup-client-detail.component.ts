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
@Component({
  selector: 'app-popup-client-detail',
  templateUrl: './popup-client-detail.component.html',
  styleUrls: ['./popup-client-detail.component.css']
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
          const clientsData: any[] = data.data;
          this.cliente = clientsData[0];
          this.form.patchValue({
            codigo_Cliente: clientsData[0].customer_ERP_id,
            nombre: clientsData[0].name,
            cif: clientsData[0].cif,
            nombre_Fiscal: clientsData[0].tax_name,
            provincia: clientsData[0].province,
            localidad: clientsData[0].city,
            cp: clientsData[0].pc != 0 ? clientsData[0].phone_1: "",
            telefono_1: clientsData[0].phone_1?.toString().length == 11 ? clientsData[0].phone_1 : "" ,
            telefono_2: clientsData[0].phone_2?.toString().length == 11 ? clientsData[0].phone_2 : "",
            email: clientsData[0].email,
            segmentacion_1: clientsData[0].descripcion_s1,
            segmentacion_2: clientsData[0].descripcion_s2,
            segmentacion_3: clientsData[0].descripcion_s3,
            direccion: clientsData[0].address,
          });
          this.inactivo = clientsData[0].deleted;
          this.tieneAppInWhats = clientsData[0].has_AIW;
          this.pedidoValorado = clientsData[0].has_unvalued_order;
          this.contacts = clientsData[0].contacts;
          this.cargando = false;
        },
        (error) => {
          console.error('Error al asignar el dataSource:', error);
          this.cargando = false;
        }
      );
  }

  cancelar() {
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
    const dialogRef = this.dialog.open(ClientsGeneralComponent, {
      width: '1000px',
      disableClose: true,
      data: { id: this.id_cliente },
    });

    dialogRef.afterClosed().subscribe((data) => {
      console.log(data);

      console.log('The dialog was closed');
    });
  }
}


