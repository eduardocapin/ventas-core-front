import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../rechazos-general.component';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) map!: GoogleMap;
  
  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Coordenadas de Madrid, España
  zoom = 5; // Nivel de Zoom predefinido mapa vacío
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
  };
  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow | null = null;

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: UserData[] }
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = { 
        lat: this.data.selectedRows[0].latitud,
        lng: this.data.selectedRows[0].longitud
      };
    }
  }

  ngAfterViewInit(): void {
    this.addMarkers();
    this.fitBoundsToMarkers();
  }

  addMarkers() {
    this.markers = this.data.selectedRows.map(row => {
      const markerIcon = this.getMarkerIcon(row.estado);
      const marker = new google.maps.Marker({
        position: { lat: row.latitud, lng: row.longitud },
        title: row.cliente,
        map: this.map?.googleMap,
        icon: {
          url: markerIcon,
          scaledSize: new google.maps.Size(35, 40) // Ajusta el tamaño del marcador
        }
      });

      const estadoColor = this.getEstadoColor(row.estado);
      const infoContent = `
        <div>
          <h2>${row.cliente}</h2>
          <p style="color:${estadoColor};"><strong>${row.estado}</strong></p>
          <p>${row.poblacion}, ${row.provincia}</p>
          <p><strong>${row.producto}</strong></p>
          <p><strong>${row.rechazo}</strong></p>
        </div>
      `;

      const infoWindow = new google.maps.InfoWindow({
        content: infoContent
      });

      marker.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
        this.infoWindow = infoWindow;
        infoWindow.open(this.map?.googleMap, marker);
      });

      return marker;
    });
  }

  getMarkerIcon(estado: string): string {
    switch (estado) {
      case 'Rechazado':
        return 'assets/icon/rechazado_marker.png';
      case 'En Proceso':
        return 'assets/icon/enproceso_marker.png';
      case 'Vendido':
        return 'assets/icon/vendido_marker.png';
      case 'No aplica':
        return 'assets/icon/noaplica_marker.png';
      default:
        return '';
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'Rechazado':
        return 'red';
      case 'En Proceso':
        return 'blue';
      case 'Vendido':
        return 'green';
      case 'No aplica':
        return 'gray';
      default:
        return 'black';
    }
  }

  fitBoundsToMarkers() {
    if (this.map?.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition() as google.maps.LatLng));
      
      if (this.markers.length === 1) {
        // Si solo hay un marcador, centra el mapa en su posición y aplica un zoom
        this.map.googleMap.setCenter(bounds.getCenter());
        this.map.googleMap.setZoom(15); //Nivel de Zoom
      } else {
        // Si hay más de un marcador, ajusta el mapa para mostrar todos los marcadores
        this.map.googleMap.fitBounds(bounds);
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
