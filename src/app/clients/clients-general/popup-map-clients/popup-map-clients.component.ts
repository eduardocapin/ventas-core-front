// src/app/clients/clients-general/popup-map-clients/popup-map-clients.component.ts
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GoogleMap } from '@angular/google-maps';
import { IClient } from 'src/app/models/clients.model'; // Actualizar esta línea
import { MapData } from 'src/app/models/mapData.model';

@Component({
  selector: 'mobentis-popup-map-clients',
  templateUrl: './popup-map-clients.component.html',
  styleUrls: ['./popup-map-clients.component.scss'],
})
export class PopupMapClientsComponent implements OnInit {
  markersData: MapData[] = [];
  center = { lat: 41.3851, lng: 2.1734 }; // Coordenadas de Barcelona

  constructor(
    public dialogRef: MatDialogRef<PopupMapClientsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { clients: IClient[] }
  ) {}

  ngOnInit(): void {
    if (this.data.clients.length > 0) {
      this.center = {
        lat: this.data.clients[0].latitude,
        lng: this.data.clients[0].longitude,
      };
    }

    this.markersData = this.data.clients.map((client) => ({
      latitude: client.latitude,
      longitude: client.longitude,
      title: client.name,
      infoContent: `
          <div>
            <h2>${client.name}</h2>
            <p>${client.city}, ${client.province}</p>
            <p>${client.pc}</p>
          </div>
        `,
    }));
  }

  close() {
    this.dialogRef.close();
  }
}
