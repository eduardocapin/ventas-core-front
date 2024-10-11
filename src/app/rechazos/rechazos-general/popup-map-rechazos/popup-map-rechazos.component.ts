import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapData } from 'src/app/models/mapData.model';
import { IRechazo } from 'src/app/models/rechazos.model';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map-rechazos.component.html',
  styleUrls: ['./popup-map-rechazos.component.css']
})
export class PopupMapComponent {
  markersData: MapData[]= [];
  center = { lat: 40.4168, lng: -3.7038 }; // Coordenadas de Madrid

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: IRechazo[] }
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = {
        lat: this.data.selectedRows[0].latitude,
        lng: this.data.selectedRows[0].longitude
      };
    }

    this.markersData = this.data.selectedRows.map(row => ({
      latitude: row.latitude,
      longitude: row.longitude,
      title: row.customer_name,
      infoContent: `
        <div>
          <h2>${row.customer_name}</h2>
          <p><strong style="color:${this.getEstadoColor(row.status)};">${row.status}</strong></p>
          <p>${row.city}, ${row.province}</p>
          <p><strong>${row.product}</strong></p>
          <p style="color:red;"><strong>${row.reason_rejection}</strong></p>
        </div>
      `,
      iconUrl: this.getMarkerIcon(row.status)
    }));
  }

  getMarkerIcon(estado: string): string {
    const basePath = 'assets/icon/';
    switch (estado) {
      case 'Rechazado': return `${basePath}rechazado_marker.png`;
      case 'Oportunidad': return `${basePath}enproceso_marker.png`;
      case 'Vendido': return `${basePath}vendido_marker.png`;
      case 'Desistido': return `${basePath}noaplica_marker.png`;
      case 'Aceptado': return `${basePath}aceptado_marker.png`;
      case 'Pendiente': return `${basePath}pendiente_marker.png`;
      default: return '';
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Rechazado': return 'red';
      case 'Oportunidad': return 'blue';
      case 'Vendido': return 'green';
      case 'Desistido': return 'gray';
      case 'Aceptado': return 'green';
      case 'Pendiente': return 'orange';
      default: return 'black';
    }
  }

  close() {
    this.dialogRef.close();
  }
}
