import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapData } from 'src/app/models/mapData.model';
import { IRechazo } from 'src/app/models/rechazos.model';

@Component({
  selector: 'mobentis-popup-map',
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
    console.log('Rechazos seleccionados:', this.data.selectedRows.length);
    
    if (this.data.selectedRows.length > 0) {
      this.center = {
        lat: this.data.selectedRows[0].latitude,
        lng: this.data.selectedRows[0].longitude
      };
      console.log('Centro del mapa:', this.center);
    }

    this.markersData = this.data.selectedRows.map(row => {
      console.log(`Rechazo ${row.id}:`, {
        customer: row.customer_name,
        status: row.status,
        lat: row.latitude,
        lng: row.longitude,
        city: row.city,
        province: row.province
      });
      
      return {
        latitude: row.latitude,
        longitude: row.longitude,
        title: row.customer_name,
        infoContent: `
          <div style="padding: 10px; font-family: Arial, sans-serif; min-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; font-weight: bold;">${row.customer_name}</h3>
            <div style="background-color: ${this.getEstadoBackgroundColor(row.status)}; 
                        color: white; 
                        padding: 6px 12px; 
                        border-radius: 4px; 
                        margin: 8px 0; 
                        font-weight: bold; 
                        text-align: center;
                        font-size: 14px;">
              ${row.status.toUpperCase()}
            </div>
            <p style="margin: 5px 0; color: #666; font-size: 13px;">
              <i class="bi bi-geo-alt-fill" style="color: #007bff;"></i> ${row.city}, ${row.province}
            </p>
            <p style="margin: 5px 0; color: #333; font-size: 13px;">
              <strong>Producto:</strong> ${row.product}
            </p>
            <p style="margin: 5px 0; color: #d32f2f; font-size: 13px; font-weight: 600;">
              <strong>Motivo:</strong> ${row.reason_rejection}
            </p>
          </div>
        `,
        iconUrl: this.getMarkerIcon(row.status)
      };
    });
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
      case 'Rechazado': return '#d32f2f';
      case 'Oportunidad': return '#1976d2';
      case 'Vendido': return '#388e3c';
      case 'Desistido': return '#757575';
      case 'Aceptado': return '#388e3c';
      case 'Pendiente': return '#f57c00';
      default: return '#424242';
    }
  }

  getEstadoBackgroundColor(estado: string): string {
    switch (estado) {
      case 'Rechazado': return '#d32f2f'; // Rojo
      case 'Oportunidad': return '#1976d2'; // Azul
      case 'Vendido': return '#388e3c'; // Verde
      case 'Desistido': return '#757575'; // Gris
      case 'Aceptado': return '#388e3c'; // Verde
      case 'Pendiente': return '#f57c00'; // Naranja
      default: return '#424242'; // Gris oscuro
    }
  }

  close() {
    this.dialogRef.close();
  }
}
