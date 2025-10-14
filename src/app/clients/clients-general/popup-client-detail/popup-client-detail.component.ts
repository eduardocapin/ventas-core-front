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
import { PopupMapClientsComponent } from '../popup-map-clients/popup-map-clients.component';
import { MapData } from 'src/app/models/mapData.model';
@Component({
  selector: 'app-popup-client-detail',
  templateUrl: './popup-client-detail.component.html',
  styleUrls: ['./popup-client-detail.component.scss'],
})
export class PopupClientDetailComponent {
  id_cliente: number = 0;
  form: any;
  inactivo: boolean = false;
  tieneAppInWhats: boolean = true;
  pedidoValorado: boolean = true;
  cliente?: IClient;
  cargando: boolean = false;
  
  // Propiedades para el mapa
  mapCenter: { lat: number; lng: number } | undefined;
  markersData: MapData[] = [];

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
          const clientsData: IClient = data;
          this.cliente = clientsData;
          this.inactivo = clientsData.deleted;
          this.cargando = false;
          
          // Configurar datos del mapa
          this.setupMapData();
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

  verEnMapa() {
    const dialogRef = this.dialog.open(PopupMapClientsComponent, {
      width: '80%',
      height: '75%',
      data: {
        clients: [this.cliente],
      },
    });
  }

  setupMapData() {
    console.log('Cliente datos:', this.cliente);
    if (this.cliente && this.cliente.latitude && this.cliente.longitude) {
      console.log('Configurando mapa con coordenadas:', this.cliente.latitude, this.cliente.longitude);
      this.mapCenter = {
        lat: this.cliente.latitude,
        lng: this.cliente.longitude,
      };

      this.markersData = [{
        latitude: this.cliente.latitude,
        longitude: this.cliente.longitude,
        title: this.cliente.name || 'Cliente',
        infoContent: `
          <div>
            <h6>${this.cliente.name || 'Cliente'}</h6>
            <p>${this.cliente.city || ''}, ${this.cliente.province || ''}</p>
            <p>${this.cliente.pc || ''}</p>
          </div>
        `,
      }];
      console.log('MapCenter:', this.mapCenter);
      console.log('MarkersData:', this.markersData);
    } else {
      console.log('No hay coordenadas válidas para el cliente');
    }
  }
}
