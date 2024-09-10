import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IRechazo } from 'src/app/models/rechazos.model';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map-rechazos.component.html',
  styleUrls: ['./popup-map-rechazos.component.css']
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
    @Inject(MAT_DIALOG_DATA) public data: { selectedRows: IRechazo[] }
  ) {}

  ngOnInit(): void {
    if (this.data.selectedRows.length > 0) {
      this.center = {
        lat: this.data.selectedRows[0].latitude,
        lng: this.data.selectedRows[0].longitude
      };
    }
    console.log('Centro del mapa:', this.center); // Depuración
  }

  ngAfterViewInit(): void {
    this.addMarkers();
    this.fitBoundsToMarkers();
  }

  addMarkers() {
    this.markers = this.data.selectedRows.map(row => {
      const marker = new google.maps.Marker({
        position: { lat: row.latitude, lng: row.longitude },
        title: row.customer_name,
        map: this.map?.googleMap,
        icon: {
          url: this.getMarkerIcon(row.status),
          scaledSize: new google.maps.Size(25, 33), // Ajusta el tamaño según sea necesario
          size: new google.maps.Size(40, 40), // Tamaño original del icono
          origin: new google.maps.Point(0, 0), // Origen de la imagen
          anchor: new google.maps.Point(20, 20) // Punto de anclaje de la imagen
        }
      });

      console.log('Añadiendo marcador:', marker); // Depuración

      const estadoColor = this.getEstadoColor(row.status);

      const infoContent = `
        <div>
          <h2>${row.customer_name}</h2>
          <p><strong style="color:${estadoColor};">${row.status}</strong></p>
          <p>${row.city}, ${row.province}</p>
          <p><strong>${row.product}</strong></p>
          <p style="color:red;"><strong>${row.reason_rejection}</strong></p>
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
    const basePath = 'assets/icon/';

    switch (estado) {
      case 'Rechazado':
        return `${basePath}rechazado_marker.png`;
      case 'En Proceso':
        return `${basePath}enproceso_marker.png`;
      case 'Vendido':
        return `${basePath}vendido_marker.png`;
      case 'No aplica':
        return `${basePath}noaplica_marker.png`;
      default:
        return ''; // Devuelve una cadena vacía si el estado no coincide con ninguno de los casos anteriores
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
        return 'black'; // Color por defecto si el estado no coincide con ninguno de los casos anteriores
    }
  }

  fitBoundsToMarkers() {
    if (this.map?.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => {
        bounds.extend(marker.getPosition() as google.maps.LatLng);
      });

      console.log('Límites del mapa:', bounds); // Depuración

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
